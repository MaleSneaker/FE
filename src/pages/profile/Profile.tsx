import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Descriptions,
  Button,
  Row,
  Col,
  Tag,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastProvider';
import { formatDate } from '../../utils';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleViewOrders = () => {
    navigate('/profile/my-orders');
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
              <div className="space-y-3">
                <Button 
                  type="primary" 
                  icon={<HistoryOutlined />}
                  onClick={handleViewOrders}
                  size="large"
                  block
                >
                  Xem lịch sử đơn hàng
                </Button>

              </div>
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
    </div>
  );
};

export default Profile;