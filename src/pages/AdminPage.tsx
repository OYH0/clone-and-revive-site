
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import AdminRoute from '@/components/AdminRoute';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import UserManagement from '@/components/admin/UserManagement';
import TabPermissionsManager from '@/components/TabPermissionsManager';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'financeiro' | 'visualizador';

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  role: UserRole;
  created_at: string;
}

const AdminPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, is_admin, role, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar usuários",
          variant: "destructive"
        });
      } else {
        setProfiles(data || []);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-100">
        <Sidebar />
        
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <AdminHeader />
            <AdminStatsCards profiles={profiles} />
            <UserManagement 
              profiles={profiles} 
              loading={loading} 
              onRefresh={fetchProfiles} 
            />
            <TabPermissionsManager profiles={profiles} />
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminPage;
