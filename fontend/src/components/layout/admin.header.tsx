'use client'
import { AdminContext } from '@/library/admin.context';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { useContext } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { signOut } from "next-auth/react"
interface IProps {
    user: IUser | null | undefined; // Dùng chính interface bạn vừa tạo
}
const AdminHeader = (props: IProps) => {
    const { user } = props;
    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <span>Settings</span>,
            icon: <SettingOutlined />
        },
        {
            key: '4',
            danger: true,
            label: <span>Đăng xuất</span>,
            onClick: () => signOut({ callbackUrl: "/auth/login" }),
            icon: <LogoutOutlined />,
        },
    ];

    return (
        <>
            <Header
                style={{
                    padding: 0,
                    display: "flex",
                    background: "#f5f5f5",
                    justifyContent: "space-between",
                    alignItems: "center"
                }} >

                <Button
                    type="text"
                    icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapseMenu(!collapseMenu)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <Dropdown menu={{ items }} >
                    <a onClick={(e) => e.preventDefault()}
                        style={{ color: "unset", lineHeight: "0 !important", marginRight: 20 }}
                    >
                        <Space>
                            WELCOME{user?.name}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Header>
        </>
    )
}

export default AdminHeader;