import { useState, useMemo, useRef } from "react";
import { motion, Reorder } from "framer-motion";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, ExternalLink, Search, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { banners as initialBanners, Banner } from "@/data/banners";

const AdminBanners = () => {
  const { toast } = useToast();
  const [bannerList, setBannerList] = useState<Banner[]>(initialBanners);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    active: true
  });

  // Filtrar banners
  const filteredBanners = useMemo(() => {
    return bannerList
      .filter((banner) => {
        const matchesSearch =
          banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          banner.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          filterStatus === 'all' ||
          (filterStatus === 'active' && banner.active) ||
          (filterStatus === 'inactive' && !banner.active);
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.order - b.order);
  }, [bannerList, searchTerm, filterStatus]);

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      linkUrl: "",
      active: true
    });
    setEditingBanner(null);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || "",
      active: banner.active
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBanner) {
      setBannerList(prev => prev.map(b => 
        b.id === editingBanner.id 
          ? { ...b, ...formData }
          : b
      ));
      toast({ title: "Banner atualizado!", description: "As alterações foram salvas." });
    } else {
      const newBanner: Banner = {
        id: Date.now().toString(),
        ...formData,
        order: bannerList.length + 1
      };
      setBannerList(prev => [...prev, newBanner]);
      toast({ title: "Banner criado!", description: "O novo banner foi adicionado." });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setBannerList(prev => prev.filter(b => b.id !== id));
    toast({ title: "Banner excluído!", description: "O banner foi removido." });
  };

  const toggleActive = (id: string) => {
    setBannerList(prev => prev.map(b => 
      b.id === id ? { ...b, active: !b.active } : b
    ));
  };

  const handleReorder = (newOrder: Banner[]) => {
    const updatedBanners = newOrder.map((banner, index) => ({
      ...banner,
      order: index + 1
    }));
    setBannerList(updatedBanners);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simular upload - em produção, enviaria para um servidor
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
        toast({ title: "Imagem carregada!", description: "A imagem foi processada com sucesso." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
        toast({ title: "Imagem carregada!", description: "A imagem foi processada com sucesso." });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Banners</h1>
          <p className="text-muted-foreground mt-1">Gerencie os banners do carrossel da página inicial</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Editar Banner" : "Novo Banner"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título do banner"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Descrição do banner"
                  required
                />
              </div>
              
              {/* Área de Upload de Imagem */}
              <div className="space-y-2">
                <Label>Imagem do Banner</Label>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {formData.imageUrl ? (
                    <div className="space-y-3">
                      <div className="rounded-lg overflow-hidden h-40 bg-muted">
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Clique ou arraste para substituir a imagem
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Arraste uma imagem ou clique para fazer upload</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou WEBP até 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Opção de URL */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">ou cole uma URL</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkUrl">URL do Link (opcional)</Label>
                <Input
                  id="linkUrl"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="https://exemplo.com/pagina"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Banner ativo</Label>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingBanner ? "Salvar Alterações" : "Criar Banner"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou subtítulo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(searchTerm || filterStatus !== 'all') && (
          <div className="mt-2 text-sm text-muted-foreground">
            {filteredBanners.length} banner(s) encontrado(s)
          </div>
        )}
      </div>

      {/* Banner List with Drag and Drop */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <GripVertical className="w-4 h-4" />
          Arraste os banners para reordenar
        </p>
        
        <Reorder.Group 
          axis="y" 
          values={filteredBanners} 
          onReorder={handleReorder}
          className="space-y-3"
        >
          {filteredBanners.map((banner) => (
            <Reorder.Item
              key={banner.id}
              value={banner}
              className={`bg-card border border-border rounded-xl p-4 flex items-center gap-4 cursor-grab active:cursor-grabbing ${
                !banner.active ? "opacity-60" : ""
              }`}
            >
              <div className="text-muted-foreground hover:text-foreground">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="w-32 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                    #{banner.order}
                  </span>
                  <h3 className="font-semibold text-foreground truncate">{banner.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground truncate">{banner.subtitle}</p>
                {banner.linkUrl && (
                  <div className="flex items-center gap-1 text-xs text-primary mt-1">
                    <ExternalLink className="w-3 h-3" />
                    <span className="truncate">{banner.linkUrl}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActive(banner.id)}
                  className={banner.active ? "text-green-600" : "text-muted-foreground"}
                >
                  {banner.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(banner)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir banner?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O banner será permanentemente removido.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(banner.id)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {filteredBanners.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' 
                ? "Nenhum banner encontrado com os filtros aplicados" 
                : "Nenhum banner cadastrado"}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar primeiro banner
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBanners;
