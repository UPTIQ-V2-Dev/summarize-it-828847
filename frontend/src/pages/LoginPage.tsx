import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@/components/common/ErrorMessage';

import { authService } from '@/services/auth';
import { loginFormSchema, type LoginFormInput } from '@/utils/validationSchemas';
import { isAuthenticated } from '@/lib/api';

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const form = useForm<LoginFormInput>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: () => {
            navigate('/', { replace: true });
        }
    });

    const onSubmit = (data: LoginFormInput) => {
        loginMutation.mutate(data);
    };

    // Redirect if already authenticated
    if (isAuthenticated()) {
        navigate('/', { replace: true });
        return null;
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-background px-4'>
            <Card className='w-full max-w-md'>
                <CardHeader className='text-center'>
                    <CardTitle className='text-2xl font-bold'>Welcome Back</CardTitle>
                    <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4'
                        >
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                placeholder='Enter your email'
                                                disabled={loginMutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder='Enter your password'
                                                    disabled={loginMutation.isPending}
                                                    className='pr-10'
                                                    {...field}
                                                />
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='sm'
                                                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                                                    onClick={() => setShowPassword(prev => !prev)}
                                                    disabled={loginMutation.isPending}
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className='h-4 w-4 text-muted-foreground' />
                                                    ) : (
                                                        <Eye className='h-4 w-4 text-muted-foreground' />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {loginMutation.isError && (
                                <ErrorMessage
                                    message={
                                        loginMutation.error instanceof Error
                                            ? loginMutation.error.message
                                            : 'Login failed. Please try again.'
                                    }
                                />
                            )}

                            <Button
                                type='submit'
                                className='w-full'
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
