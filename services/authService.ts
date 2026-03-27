import { supabase } from '@/services/supabase';

export const registerUser = async (fullName: string, email: string, phone: string, password: string) => {
    const { data: newUserId, error } = await supabase.rpc('register_user', {
        p_full_name: fullName,
        p_email: email,
        p_phone: phone,
        p_raw_password: password
    });

    if (error) {
        console.error('Erro ao Cadastrar Usuário:', error.message);
        throw new Error('Falha a criar conta. Verifique os dados.');
    }

    return newUserId;
};