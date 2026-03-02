
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

public class AuthIntegrationTests : IClassFixture<WebApplicationFactory<Program>> {
  private readonly HttpClient _client;
  public AuthIntegrationTests(WebApplicationFactory<Program> factory){
    _client = factory.CreateClient();
  }

  [Fact]
  public async Task Login_Returns_Unauthorized_With_Invalid(){
    var res = await _client.PostAsJsonAsync("/api/auth/login", new{ Email="x", Password="y"});
    Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
  }
}
