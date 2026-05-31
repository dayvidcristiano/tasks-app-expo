import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { globalStyles } from '../styles/global';
import { useAuthStore } from '../store/useAuthStore';
import { loginAPI, signupAPI, logoutAPI } from '../utils/handle-api';

interface AboutScreenProps {
  onClose: () => void;
}

export default function AboutScreen({ onClose }: AboutScreenProps) {
  const { user, setAuth, logout } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email.trim() || !password.trim() || (!isLogin && !name.trim())) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const data = await loginAPI({
          email,
          password,
        });

        setAuth(data.token, data.user);
      } else {
        const data = await signupAPI({
          name,
          email,
          password,
        });

        setAuth(data.token, data.user);
      }

      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) {
      console.log(
        'AUTH ERROR:',
        err.response?.status,
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erro ao autenticar'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.log(error);
    }

    logout();
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={require('../../assets/task-app-banner.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Sobre o App</Text>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Bem-vindo ao Gerenciador de Tarefas! Este aplicativo foi desenvolvido com o intuito de facilitar a organização do seu dia a dia, permitindo o acompanhamento de suas atividades de forma simples, rápida e eficiente.
        </Text>
        <Text style={styles.paragraph}>
          Com uma interface moderna e intuitiva, você pode adicionar novas tarefas, marcar as que já foram concluídas e definir prioridades. O objetivo principal é proporcionar uma experiência fluida para aumentar a sua produtividade e focar no que realmente importa.
        </Text>
        <Text style={styles.paragraph}>
          Desenvolvido como um projeto de estudo e aplicação de melhores práticas em desenvolvimento mobile, o Gerenciador de Tarefas utiliza tecnologias de ponta para entregar um aplicativo robusto, performático e disponível para múltiplas plataformas a partir do mesmo código-fonte.
        </Text>
      </View>

      <Text style={styles.subtitle}>Tecnologias Utilizadas</Text>

      <View style={styles.techList}>
        <Text style={styles.techItem}>• React Native</Text>
        <Text style={styles.techItem}>• Expo</Text>
        <Text style={styles.techItem}>• TypeScript</Text>
        <Text style={styles.techItem}>• EAS</Text>
      </View>

      <Text style={styles.subtitle}>{user ? 'Minha Conta' : (isLogin ? 'Login' : 'Criar Conta')}</Text>

      <View style={styles.authCard}>
        {user ? (
          <>
            <Text style={styles.authLabel}>Nome</Text>
            <Text style={styles.authValue}>
              {user.name || 'Usuário'}
            </Text>

            <Text style={styles.authLabel}>E-mail</Text>
            <Text style={styles.authValue}>
              {user.email}
            </Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#FFF" />
                : <Text style={styles.primaryButtonText}>{isLogin ? 'Entrar' : 'Cadastrar'}</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => { setIsLogin(!isLogin); setError(''); }}
            >
              <Text style={styles.toggleButtonText}>
                {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Fechar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 32,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: globalStyles?.primaryColor || '#000',
    marginTop: 16,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: 24,
    width: '100%',
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'justify',
  },
  techList: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: globalStyles?.primaryColor || '#000',
    marginBottom: 32,
  },
  techItem: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  // Auth
  authCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  authValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: globalStyles?.primaryColor || '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: globalStyles?.primaryColor || '#000',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#F44336',
    marginBottom: 12,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: globalStyles?.primaryColor || '#000',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    marginBottom: 32,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});