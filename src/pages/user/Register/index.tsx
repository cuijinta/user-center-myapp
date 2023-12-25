import Footer from '@/components/Footer';
import {register} from '@/services/ant-design-pro/api';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormText,} from '@ant-design/pro-components';
import {message, Tabs} from 'antd';
import React, {useState} from 'react';
import {history, Link} from 'umi';
import styles from './index.less';
import {SYSTEM_LOGO} from "@/constants";

const Register: React.FC = () => {
    const [type
        , setType] = useState<string>('account');
    //表单提交
    const handleSubmit = async (values: API.RegisterParams) => {
        const {userPassword, checkPassword} = values;
        //校验
        if (userPassword !== checkPassword) {
            return message.error('两次输入密码不一致');
        }


        // 注册
        // const id = await register(values);
        const res = await register(values);
        if (res) {
            const defaultLoginSuccessMessage = '注册成功！';
            message.success(defaultLoginSuccessMessage);

            /** 此方法会跳转到 redirect 参数所在的位置 */
            if (!history) return;
            const {query} = history.location;
            // const {redirect} = query as {
            //   redirect: string;
            // };
            // history.push('/user/userLogin?redirect=' + redirect);
            history.push({
                pathname: '/user/login',
                query,
            });
            return;
        }
        // else {
        //     const defaultLoginFailureMessage = '注册失败，';
        //     message.error(res.message ?? defaultLoginFailureMessage);
        // }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <LoginForm
                    submitter={
                        {
                            searchConfig: {
                                submitText: '注册'
                            }
                        }}
                    logo={<img alt="logo" src={SYSTEM_LOGO}/>}
                    title="用户中心"
                    // subTitle={'Ant Design 是西湖区最具影响力的 Web 设计规范'}
                    subTitle={'系列项目的用户管理与控制中心'}
                    initialValues={{
                        autoLogin: true,
                    }}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.RegisterParams);
                    }}
                >
                    <Tabs activeKey={type} onChange={setType}>
                        <Tabs.TabPane key="account" tab={'账户密码注册'}/>
                        {/*<Tabs.TabPane key="mobile" tab={'手机号注册'}/>*/}
                    </Tabs>

                    {type === 'account' && (
                        <>
                            <ProFormText
                                name="userAccount"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder={'请输入账户名'}
                                rules={[
                                    {
                                        required: true,
                                        message: '账户是必填项！',
                                    },
                                ]}
                            />

                            <ProFormText.Password
                                name="userPassword"
                                fieldProps={{
                                    size: 'large',
                                    type: 'password',
                                    prefix: <LockOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder={'请输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '密码是必填项！',
                                    },
                                    {
                                        min: 8,
                                        type: 'string',
                                        message: '密码长度不低于8位',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="checkPassword"
                                fieldProps={{
                                    size: 'large',
                                    type: 'password',
                                    prefix: <LockOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder={'请再次输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '密码不一致',
                                    },
                                    {
                                        min: 8,
                                        type: 'string',
                                        message: '密码长度不低于8位',
                                    },
                                ]}
                            />

                            <ProFormText
                                name="code"
                                fieldProps={{
                                    size: 'large',
                                    // prefix: <UserOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder={'你的专属编号'}
                                rules={[
                                    {
                                        required: true,
                                        message: '编号是必填项！',
                                    },
                                ]}
                            />

                        </>
                    )}


                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <Link to="/user/login">
                            已有账号？去登录
                        </Link>
                    </div>
                </LoginForm>
            </div>
            <Footer/>
        </div>
    );
};
export default Register;
