import { TagOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Badge, Tooltip } from 'antd';

const GoodsRibbon = (props) => {
  const { goodsType } = props;
  console.log(props);
  if (goodsType === 3) {
    return (
      <Badge.Ribbon
        text={
          <Tooltip title="特货">
            <TagOutlined />
          </Tooltip>
        }
        color="volcano"
      >
        {props.children}
      </Badge.Ribbon>
    );
  } else if (goodsType === 2) {
    return (
      <Badge.Ribbon
        text={
          <Tooltip title="带电">
            <ThunderboltOutlined />
          </Tooltip>
        }
        color="gold"
      >
        {props.children}
      </Badge.Ribbon>
    );
  } else {
    console.log('no ribbon');
    return props.children;
  }
};

export default GoodsRibbon;
