import { addComment, deleteComment, getComment } from '@/services/apis/goods';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProForm, ProFormText, ProList } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';

export type CommentTableParams = {
  goodsId: number;
};
const CommentTable: React.FC<CommentTableParams> = ({ goodsId }) => {
  const actionRef = useRef<ActionType>();
  const [recordContent, setRecordContent] = useState('');

  const handleDeleteGoodsComment = async (commentId: number) => {
    await deleteComment(commentId);
    actionRef.current?.reload();
    message.success('删除成功');
    return true;
  };

  /*富文本编辑*/
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };
  return (
    <ProList<{ recId: number; title: string; content: string; createdAt: number }>
      request={() => getComment(goodsId)}
      actionRef={actionRef}
      metas={{
        title: { dataIndex: 'user' },
        description: {
          dataIndex: 'content',
          render: (_, row) => {
            return (
              <div
                dangerouslySetInnerHTML={{
                  __html: `${row.content.replaceAll('\n', '</br>')}`,
                }}
                style={{ height: '200px', overflow: 'auto' }}
              ></div>
            );
          },
        },
        avatar: { dataIndex: 'avatar' },
        subTitle: {
          render: (_, row) => {
            return [
              <span key="fakeTime">
                {moment(row.createdAt * 1000).format('YYYY-MM-DD HH:mm:ss')}
              </span>,
            ];
          },
        },
        actions: {
          render: (_, row) => {
            if (!row.owner) {
              return '';
            }
            return [
              <Popconfirm
                key={'goodsCommentId' + row.recId}
                title="确认删除商品记录吗？"
                onConfirm={() => handleDeleteGoodsComment(row.recId)}
              >
                <Button key={'goodsCommentDelBtn' + row.recId} size="small" danger type="link">
                  删除
                </Button>
              </Popconfirm>,
            ];
          },
        },
      }}
      toolBarRender={() => {
        return [
          <ModalForm
            initialValues={{ goodsId: goodsId }}
            key="addComment"
            onFinish={async (values) => {
              await addComment({ ...values, content: recordContent });
              actionRef.current?.reloadAndRest?.();
              setRecordContent('');
              message.success('提交成功');
              return true;
            }}
            trigger={
              <Button type="primary">
                {' '}
                <PlusOutlined /> 记录{' '}
              </Button>
            }
          >
            <ProFormText name="goodsId" hidden disabled />
            <ProForm.Item
              label="记录"
              name="content"
              rules={[{ required: true, message: '请输入记录' }]}
              style={{ height: 400 }}
            >
              <ReactQuill
                style={{ height: 330 }}
                modules={quillModules}
                value={recordContent}
                onChange={setRecordContent}
              />
            </ProForm.Item>
          </ModalForm>,
        ];
      }}
    />
  );
};

export default CommentTable;
