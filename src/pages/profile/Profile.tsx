import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Row,
  Col,
  Tag,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastProvider';
import { formatDate } from '../../utils';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const showToast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleEditProfile = () => {
    form.setFieldsValue({
      userName: user?.userName,
      email: user?.email,
      phone: user?.phone,
    });
    setEditModalVisible(true);
  };

  interface UpdateProfileValues {
    userName: string;
    email: string;
    phone: string;
  }

  const handleUpdateProfile = async (values: UpdateProfileValues) => {
    setLoading(true);
    try {
      setTimeout(() => {
        updateUser({ ...user!, ...values });
        showToast('success', 'Cập nhật thông tin thành công');
        setEditModalVisible(false);
        setLoading(false);
      }, 1000);
    } catch {
      showToast('error', 'Cập nhật thông tin thất bại');
      setLoading(false);
    }
  };

  const handleUploadAvatar = () => {
    message.info('Tính năng đang phát triển');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <Text>Vui lòng đăng nhập để xem thông tin cá nhân</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Title level={3}>Thông tin cá nhân</Title>
        <Text type="secondary">Quản lý thông tin tài khoản của bạn</Text>
      </div>

      <Row gutter={[24, 24]}>

        <Col xs={24} lg={12}>
          <Card>
            <div className="text-center mb-6">
              <Avatar
                size={120}
                src={user.avatar}
                icon={<UserOutlined />}
                className="mb-4"
              />
              
              <Title level={4} className="mb-2">{user.userName}</Title>
              <Text type="secondary" className="flex items-center justify-center gap-1">
                <MailOutlined />
                {user.email}
              </Text>
            </div>

            <div className="text-center">
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleEditProfile}
                size="large"
              >
                Chỉnh sửa thông tin
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Chi tiết tài khoản">
            <Descriptions column={1} size="middle">
              <Descriptions.Item 
                label={
                  <span className="flex items-center gap-2">
                    <UserOutlined />
                    Tên người dùng
                  </span>
                }
              >
                <Text strong>{user.userName}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={
                  <span className="flex items-center gap-2">
                    <MailOutlined />
                    Email
                  </span>
                }
              >
                <Text>{user.email}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={
                  <span className="flex items-center gap-2">
                    <PhoneOutlined />
                    Số điện thoại
                  </span>
                }
              >
                <Text>{user.phone}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={
                  <span className="flex items-center gap-2">
                    <CalendarOutlined />
                    Ngày tham gia
                  </span>
                }
              >
                <Text>{user.createdAt ? formatDate(user.createdAt) : 'Không có thông tin'}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Vai trò">
                <Tag color={user.role === 'admin' ? 'red' : 'blue'}>
                  {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                </Tag>
              </Descriptions.Item>

              {user.blocked?.isBlocked && (
                <Descriptions.Item label="Trạng thái tài khoản">
                  <Tag color="red">Đã bị khóa</Tag>
                  <br />
                  <Text type="secondary" className="text-sm">
                    Lý do: {user.blocked.description}
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            label="Tên người dùng"
            name="userName"
            rules={[
              { required: true, message: 'Vui lòng nhập tên người dùng' },
              { min: 2, message: 'Tên phải có ít nhất 2 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" disabled />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setEditModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;