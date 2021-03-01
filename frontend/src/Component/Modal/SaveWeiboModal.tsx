import React, { useState } from "react";
import { Modal, Form, Input, message, Tooltip } from "antd";
import { saveWeiboApi } from "../../Api";
import { QuestionCircleOutlined } from "@ant-design/icons";
interface SaveWeiboModalProps {
  visible: boolean;
  closeModal: () => void;
}

export default function SaveWeiboModal(props: SaveWeiboModalProps) {
  const { visible, closeModal } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      title="Save A Weibo"
      confirmLoading={loading}
      onCancel={() => {
        closeModal();
        form.resetFields();
      }}
      onOk={async () => {
        setLoading(true);
        try {
          const value = await form.validateFields();
          const response = await saveWeiboApi(value.weiboIdUrl);
          setLoading(false);
          closeModal();
          form.resetFields();
          if (response?.data?.status === "error") {
            message.error(
              response?.data?.message ||
                `weibo "${value.weiboIdUrl}" doesn't exist or the token has expired`
            );
          }
        } catch (err) {
          message.error("Error Network: Failed to save the weibo");
          setLoading(false);
        }
      }}
      visible={visible}
    >
      <Form form={form}>
        <Form.Item
          name="weiboIdUrl"
          label="weibo Id/Url"
          rules={[
            { required: true, message: "please input the weibo url or id" },
          ]}
        >
          <Input
            suffix={
              <Tooltip title='Copy and Paste your weibo url or Id here. The weibo url should look like: "http://weibo.com/1195210033/Jwu8jjwiO", "https://m.weibo.cn/detail/4609658210222977", or short url starts with "t.cn". A weibo Id should be a string of around 16 digits'>
                <QuestionCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
            placeholder="Paste the weibo url or Id here"
          ></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
}
