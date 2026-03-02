
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Alugme.Api.Data;
using Alugme.Api.Auth;
using Alugme.Api.Domain;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(o=>
  o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddControllers()
                .AddJsonOptions(options =>
                  {
                      options.JsonSerializerOptions.Converters.Add(
                          new System.Text.Json.Serialization.JsonStringEnumConverter()
                      );
                  });

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(o=>{
  o.TokenValidationParameters = new TokenValidationParameters{
    ValidateIssuer=true, ValidateAudience=true, ValidateLifetime=true,
    ValidIssuer=builder.Configuration["Jwt:Issuer"],
    ValidAudience=builder.Configuration["Jwt:Audience"],
    IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
  };
});

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy
            .WithOrigins("http://localhost:2400")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddSwaggerGen(c=>{
  c.SwaggerDoc("v1", new OpenApiInfo{ Title="Alugme API", Version="v1"});
  c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme{
    Name="Authorization", Type=SecuritySchemeType.Http, Scheme="bearer", BearerFormat="JWT", In=ParameterLocation.Header
  });
  c.AddSecurityRequirement(new OpenApiSecurityRequirement{
    { new OpenApiSecurityScheme{ Reference=new OpenApiReference{ Type=ReferenceType.SecurityScheme, Id="Bearer"}}, new string[]{} }
  });
});


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("FrontendDev");

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

// Seed admin
using(var scope = app.Services.CreateScope()){
  var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
  db.Database.Migrate();
  if(!db.Users.Any()){
    db.Users.Add(new User{
      Name="Admin",
      Email="admin@admin.com",
      PasswordHash=BCrypt.Net.BCrypt.HashPassword("123456"),
      Role=AppRole.Admin
    });
    db.Users.Add(new User{
      Name="Maria",
      Email="maria@admin.com",
      Photo="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      PasswordHash=BCrypt.Net.BCrypt.HashPassword("123456"),
      Role=AppRole.Locatario
    });

    var user = new User
    {
      Name="Carlos",
      Email="carlos@admin.com",
      Photo="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      PasswordHash=BCrypt.Net.BCrypt.HashPassword("123456"),
      Role=AppRole.Locador
    };
    db.Users.Add(user);

    var landlord = new Landlord
    {
      Users = new List<User>{ user }
    };

    db.Landlords.Add(landlord);

    db.SaveChanges();
  }
}

app.Run();

public partial class Program {}
