"use client"

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_verified: boolean;
}

function ActionsCell({ user, onEdit, onDelete }: { user: User; onEdit: (user: User) => void; onDelete: (id: number) => void }) {
    return (
        <div className="flex gap-2">
            <button
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                onClick={() => onEdit(user)}
            >Edit</button>
            <button
                className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                onClick={() => onDelete(user.id)}
            >Delete</button>
        </div>
    )
}

export default function Page() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' as 'admin' | 'user' | 'pemilik' });
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        fetch('/api/users', { headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_SECRET as string } })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setUsers(data.users);
                else setError(data.error || 'Gagal memuat data');
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Hapus user ini?')) return;
        setProcessing(true);
        try {
            const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE', headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_SECRET as string } });
            const data = await res.json();
            if (data.success) setUsers((prev) => prev.filter((u) => u.id !== id));
            else alert(data.error || 'Gagal menghapus user');
        } catch {
            alert('Terjadi error saat menghapus user');
        } finally {
            setProcessing(false);
        }
    };

    const handleEdit = async (user: User) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, password: '', role: user.role as 'admin' | 'user' | 'pemilik' });
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || (!editingUser && !formData.password)) {
            alert('Form tidak lengkap');
            return;
        }
        setProcessing(true);
        try {
            if (editingUser) {
                // Update existing user
                const res = await fetch('/api/users', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.NEXT_PUBLIC_API_SECRET as string },
                    body: JSON.stringify({ id: editingUser.id, name: formData.name, email: formData.email, role: formData.role }),
                });
                const data = await res.json();
                if (data.success) {
                    setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, name: formData.name, email: formData.email, role: formData.role } : u));
                    setDialogOpen(false);
                } else {
                    alert(data.error || 'Gagal edit user');
                }
            } else {
                // Create new user
                const res = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.NEXT_PUBLIC_API_SECRET as string },
                    body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, role: formData.role }),
                });
                const data = await res.json();
                if (data.success) {
                    const res2 = await fetch('/api/users');
                    const data2 = await res2.json();
                    if (data2.success) setUsers(data2.users);
                    setDialogOpen(false);
                } else {
                    alert(data.error || 'Gagal membuat user');
                }
            }
        } catch {
            alert('Terjadi error');
        } finally {
            setProcessing(false);
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'user' });
        setDialogOpen(true);
    };

    return (
        <section className='px-4 lg:px-6'>
            <div className="flex justify-between items-center mb-4">
                <h1 className='font-bold text-lg'>Daftar Users</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleCreate}>Tambah User</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'Edit User' : 'Tambah User'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Masukkan nama"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Masukkan email"
                                />
                            </div>
                            {!editingUser && (
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Masukkan password"
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={formData.role} onValueChange={(value: 'admin' | 'user' | 'pemilik') => setFormData({ ...formData, role: value })}>
                                    <SelectTrigger id="role">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="pemilik">Pemilik</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                            <Button onClick={handleSubmit} disabled={processing}>
                                {processing ? 'Memproses...' : editingUser ? 'Simpan' : 'Tambah'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className='text-red-500'>{error}</p>}
            {processing && <p className='text-blue-400'>Memproses data...</p>}
            {!loading && !error && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell><ActionsCell user={user} onEdit={handleEdit} onDelete={handleDelete} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </section>
    );
}
