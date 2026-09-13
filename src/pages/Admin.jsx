
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "../components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";

const EMPTY = { name: "", description: "", price: 0, category: "laptops", brand: "", image_url: "", images: [], stock: 0, rating: 0, specs: {}, featured: false };
const CATEGORIES = ["laptops", "phones", "audio", "wearables", "tablets", "accessories"];

function ProductForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const submit = async (e) => {
    e.preventDefault();
    await onSubmit({ ...form, price: Number(form.price), stock: Number(form.stock) });
    onClose();
  };
  const set = (k, v) => setForm({ ...form, [k]: v });
  return (
    <form onSubmit={submit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Label>Name</Label><Input required value={form.name} onChange={(e) => set("name", e.target.value)} data-testid="admin-product-name" /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea required value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
        <div><Label>Price (USD)</Label><Input type="number" step="0.01" required value={form.price} onChange={(e) => set("price", e.target.value)} data-testid="admin-product-price" /></div>
        <div><Label>Stock</Label><Input type="number" required value={form.stock} onChange={(e) => set("stock", e.target.value)} /></div>
        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger data-testid="admin-product-category"><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Brand</Label><Input required value={form.brand} onChange={(e) => set("brand", e.target.value)} /></div>
        <div className="col-span-2"><Label>Image URL</Label><Input required value={form.image_url} onChange={(e) => set("image_url", e.target.value)} /></div>
        <div className="col-span-2 flex items-center justify-between bg-[#F5F5F7] rounded-xl px-4 py-3">
          <Label>Featured</Label>
          <Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
        </div>
      </div>
      <button type="submit" className="btn-primary w-full" data-testid="admin-product-save">Save</button>
    </form>
  );
}

function ProductsAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(null);

  const load = async () => {
    const { data } = await api.get(\"/products\");
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  const create = async (p) => {
    await api.post(\"/admin/products\", p);
    toast.success(\"Product created\"); load();
  };
  const update = async (id, p) => {
    await api.put(`/admin/products/${id}`, p);
    toast.success(\"Product updated\"); load();
  };
  const del = async (id) => {
    if (!window.confirm(\"Delete this product?\")) return;
    await api.delete(`/admin/products/${id}`);
    toast.success(\"Deleted\"); load();
  };

  return (
    <div>
      <div className=\"flex items-center justify-between mb-6\">
        <h2 className=\"font-display text-2xl font-semibold\">Products ({items.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className=\"btn-accent\" data-testid=\"admin-new-product\"><Plus className=\"w-4 h-4 mr-2\" /> New product</button>
          </DialogTrigger>
          <DialogContent className=\"max-w-lg\">
            <DialogHeader><DialogTitle className=\"font-display\">New product</DialogTitle></DialogHeader>
            <ProductForm onSubmit={create} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className=\"bg-[#F5F5F7] rounded-3xl overflow-hidden\">
        <table className=\"w-full text-sm\">
          <thead className=\"bg-white/60\">
            <tr className=\"text-left\">
              <th className=\"p-4\">Product</th>
              <th className=\"p-4\">Category</th>
              <th className=\"p-4\">Price</th>
              <th className=\"p-4\">Stock</th>
              <th className=\"p-4\">Featured</th>
              <th className=\"p-4 text-right\">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className=\"border-t border-black/5\" data-testid={`admin-row-${p.id}`}>
                <td className=\"p-4 flex items-center gap-3\">
                  <img src={p.image_url} alt=\"\" className=\"w-10 h-10 rounded-xl object-cover bg-white\" />
                  <div className=\"font-medium\">{p.name}</div>
                </td>
                <td className=\"p-4 text-neutral-600\">{p.category}</td>
                <td className=\"p-4\">${p.price.toFixed(2)}</td>
                <td className=\"p-4\">{p.stock}</td>
                <td className=\"p-4\">{p.featured ? <Badge className=\"bg-[#0071E3]\">Yes</Badge> : <span className=\"text-neutral-400\">No</span>}</td>
                <td className=\"p-4 text-right space-x-2\">
                  <Dialog open={editOpen === p.id} onOpenChange={(v) => setEditOpen(v ? p.id : null)}>
                    <DialogTrigger asChild>
                      <button className=\"p-2 hover:bg-white rounded-lg\" data-testid={`admin-edit-${p.id}`}><Pencil className=\"w-4 h-4\" /></button>
                    </DialogTrigger>
                    <DialogContent className=\"max-w-lg\">
                      <DialogHeader><DialogTitle className=\"font-display\">Edit product</DialogTitle></DialogHeader>
                      <ProductForm initial={p} onSubmit={(np) => update(p.id, np)} onClose={() => setEditOpen(null)} />
                    </DialogContent>
                  </Dialog>
                  <button onClick={() => del(p.id)} className=\"p-2 hover:bg-white rounded-lg text-red-500\" data-testid={`admin-delete-${p.id}`}>
                    <Trash2 className=\"w-4 h-4\" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const load = async () => {
    const { data } = await api.get(\"/admin/orders\");
    setOrders(data);
  };
  useEffect(() => { load(); }, []);
  const setStatus = async (id, status) => {
    await api.post(`/admin/orders/${id}/status`, { status });
    toast.success(\"Updated\"); load();
  };
  return (
    <div>
      <h2 className=\"font-display text-2xl font-semibold mb-6\">Orders ({orders.length})</h2>
      <div className=\"space-y-3\">
        {orders.map((o) => (
          <div key={o.id} className=\"bg-[#F5F5F7] rounded-2xl p-5 flex items-center gap-4 flex-wrap\">
            <div className=\"font-mono text-xs\">#{o.id.slice(0, 8)}</div>
            <div className=\"text-sm text-neutral-600 flex-1 truncate\">{o.items.length} item(s) · ${o.total.toFixed(2)}</div>
            <div className=\"text-xs text-neutral-500\">{new Date(o.created_at).toLocaleDateString()}</div>
            <Select value={o.status} onValueChange={(v) => setStatus(o.id, v)}>
              <SelectTrigger className=\"w-36 bg-white\" data-testid={`admin-order-status-${o.id}`}><SelectValue /></SelectTrigger>
              <SelectContent>
                {[\"pending\", \"paid\", \"shipped\", \"delivered\", \"cancelled\"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ))}
        {orders.length === 0 && <div className=\"text-neutral-500\">No orders yet.</div>}
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up\">
      <h1 className=\"font-display text-4xl sm:text-5xl font-bold tracking-tighter mb-2\">Admin</h1>
      <p className=\"text-neutral-600 mb-10\">Manage products and orders.</p>
      <Tabs defaultValue=\"products\">
        <TabsList className=\"mb-8\">
          <TabsTrigger value=\"products\" data-testid=\"admin-tab-products\">Products</TabsTrigger>
          <TabsTrigger value=\"orders\" data-testid=\"admin-tab-orders\">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value=\"products\"><ProductsAdmin /></TabsContent>
        <TabsContent value=\"orders\"><OrdersAdmin /></TabsContent>
      </Tabs>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Admin.jsx