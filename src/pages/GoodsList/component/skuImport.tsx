import { InboxOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { message, Upload, UploadProps } from 'antd';

const uploadProps: UploadProps = {
  name: 'file',
  action: '/api/goods/skuImport',
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwt') || '',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.` + info.file.response.message);
    }
  },
};
const SkuImporter = ({ trigger }) => {
  return (
    <ModalForm key="inportModal" trigger={trigger} title="导入">
      <Upload.Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
      </Upload.Dragger>
    </ModalForm>
  );
};

export default SkuImporter;
