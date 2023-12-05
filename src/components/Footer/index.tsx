import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
const Footer: React.FC = () => {
  const defaultMessage = '浅夜出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Ant Design Pro',
          title: 'gitee',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <><GithubOutlined /> 浅夜 Github</>,
          href: 'https://github.com/cuijinta',
          blankTarget: true,
        },
        {
          key: 'QBlog',
          title: '个人博客',
          href: 'https://github.com/cuijinta/QBlog',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
