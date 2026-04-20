'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nama lengkap harus diisi'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(1, 'Nomor telepon harus diisi'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok",
  path: ["confirmPassword"],
});

export async function authenticateUser(formData: FormData) {
  const emailOrName = formData.get('username') as string;
  const password = formData.get('password') as string;

  try {
    const users = await sql`
      SELECT * FROM users 
      WHERE email = ${emailOrName} OR name = ${emailOrName}
    `;

    if (users.length === 0) {
      return { error: 'Username atau password salah' };
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: 'Username atau password salah' };
    }

    return { 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        role: user.role 
      } 
    };

  } catch (error) {
    return { error: 'Database Error: Gagal melakukan autentikasi.' };
  }
}

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await sql`
      INSERT INTO users (name, email, password, phone, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${phone}, 'Pelanggan')
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Register User.' };
  }

  revalidatePath('/dashboard-admin');
  redirect('/login');
}

export async function updateProfile(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  try {
    await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, phone = ${phone}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Profile.' };
  }

  revalidatePath('/dashboard/profile');
  return { message: 'Profil berhasil diperbarui' };
}

export async function changePassword(id: string, formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (newPassword !== confirmPassword) {
    return { error: 'confirm', message: 'Konfirmasi password tidak sesuai' };
  }

  try {
    const user = await sql`SELECT password FROM users WHERE id = ${id}`;
    if (!user.length) return { error: 'global', message: 'User tidak ditemukan' };

    const passwordMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!passwordMatch) {
        return { error: 'current', message: 'Password saat ini salah' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${id}`;
    
  } catch (error) {
    return { error: 'global', message: 'Database Error: Failed to Change Password.' };
  }

  return { success: true, message: 'Password berhasil diganti' };
}

export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Delete User.' };
  }

  revalidatePath('/dashboard-admin/users');
}

export async function fetchFilteredUsers(query: string) {
  try {
    const users = await sql`
      SELECT id, name, email, role, phone, created_at
      FROM users
      WHERE
        name ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`} OR
        role ILIKE ${`%${query}%`}
      ORDER BY created_at DESC
    `;
    // Convert dates to strings for transport
    return users.map(u => ({
      ...u,
      created_at: u.created_at.toISOString()
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

export async function getUserStats() {
  try {
    const data = await sql`SELECT COUNT(*) FROM users WHERE role = 'Pelanggan'`;
    return { totalCustomers: Number(data[0].count) };
  } catch (error) {
    return { totalCustomers: 0 };
  }
}
