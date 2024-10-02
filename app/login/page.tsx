'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Group, MantineProvider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { createClient } from '@/utils/supabase/client';
import '@mantine/core/styles.css';

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value: string) => (value.length < 6 ? 'Password should be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    const supabase = createClient();
    setLoading(true);
    try {
      await supabase.auth.signInWithPassword(
        { email: values.email, 
          password: values.password 
        });
      router.push('/');
    } catch (error) {
      notifications.show({
        title: 'Login Failed',
        message: 'Invalid email or password. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MantineProvider>
      <Container size={420} my={40}>
        <Title ta="center" fw={900}>
          Welcome back!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Enter your email and password to log in
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              {...form.getInputProps('password')}
            />
            <Group justify="flex-end" mt="md">
              <Button type="submit" loading={loading}>
                Log in
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </MantineProvider>
  );
};

export default LoginPage;