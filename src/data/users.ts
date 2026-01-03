export type UserType = 'locador' | 'locatario';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  type: UserType;
  status: boolean;
  password: string;
  createdAt: string;
  lastAccess: string;
}

export const users: User[] = [
  {
    id: '24',
    name: 'Eneias Slva',
    email: 'eneias@email.com',
    phone: '(48) 99997-1197',
    photo: 'https://lh3.googleusercontent.com/ogw/AF2bZyicfIVGpTlNWKdXFZtHfmJSrVY0F4wWv9SnXFfPNvVRn1QM=s64-c-mo',
    type: 'admin',
    status: true,
    password: '123456',
    createdAt: '2024-01-15',
    lastAccess: '2024-12-28',
  },
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos@email.com',
    phone: '(11) 99999-1111',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    type: 'locador',
    status: true,
    password: '123456',
    createdAt: '2024-01-15',
    lastAccess: '2024-12-28',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 99999-2222',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    type: 'locatario',
    status: true,
    password: '123456',
    createdAt: '2024-02-20',
    lastAccess: '2024-12-27',
  },
  {
    id: '3',
    name: 'João Oliveira',
    email: 'joao@email.com',
    phone: '(11) 99999-3333',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    type: 'locador',
    status: false,
    password: '123456',
    createdAt: '2024-03-10',
    lastAccess: '2024-11-15',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 99999-4444',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    type: 'locatario',
    status: false,
    password: '123456',
    createdAt: '2024-04-05',
    lastAccess: '2024-12-26',
  },
];
