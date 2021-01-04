import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { saveWeiboApi } from "../../Api";

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
          const response = await saveWeiboApi(value.weiboId);
          setLoading(false);
          closeModal();
          form.resetFields();
          if(response.data&&response.data.status==='error'){
            message.error(`weibo "${value.weiboId}" doesn't exist or the token has expired`)
          }
        } catch (err) {
          message.error('Error Network: Failed to save the weibo')
          setLoading(false);
        }
      }}
      visible={visible}
    >
      <Form form={form}>
        <Form.Item
          name="weiboId"
          label="weibo ID"
          rules={[{ required: true, message: "please input the weibo Id" }]}
        >
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
}
