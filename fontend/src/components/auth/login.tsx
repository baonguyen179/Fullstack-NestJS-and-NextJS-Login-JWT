'use client'
import { Button, Col, Divider, Form, Input, App, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';
import { authenticate } from '@/actions/actions';
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import ModalReactive from './modal.reactive';
import ModalChangePassword from './modal.change.password';

const Login = () => {
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isModalChangeOpen, setIsModalChangeOpen] = useState(false);
     const [userEmail, setUserEmail] = useState('');
    const { notification } = App.useApp();
    const router = useRouter()
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const onFinish = async (values: any) => {
        const { email, password } = values;
        setUserEmail('')
        const res = await authenticate(email, password)
        // console.log('check res login.tsx: ', res);

        if (res?.error) {
            notification.error({
                title: 'Đăng nhập thất bại',
                description: res?.message,
            });
            if (res?.code === 3) {
                // router.push('/verify')
                setIsModalOpen(true);
                setUserEmail(email)
                return;
            }
        } else {
            router.push('/dashboard');
            router.refresh();
        }

    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Đăng Nhập</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>



                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link href={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                        <a 
                            style={{ cursor: 'pointer', color: '#1677ff' }} 
                            onClick={(e) => {
                                e.preventDefault(); // Ngăn chặn reload trang nếu dùng thẻ a
                                setIsModalChangeOpen(true);
                            }}
                        >
                            Quên mật khẩu?
                        </a>
                    </div>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Chưa có tài khoản? <Link href={"/auth/register"}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
            <ModalReactive isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            userEmail={userEmail}
            />
            <ModalChangePassword isModalOpen={isModalChangeOpen} 
            setIsModalOpen={setIsModalChangeOpen}/>
        </Row>
    )
}

export default Login;