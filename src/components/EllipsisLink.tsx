import { Tooltip } from 'antd';

const EllipsisLink = ({
  length,
  text,
  link,
  target,
}: {
  length: number;
  text: string;
  link: string;
  target: string;
}) => {
  if (text.length > length) {
    return (
      <Tooltip title={text}>
        <a href={link} target={target}>
          {text.substring(0, length) + '...'}
        </a>
      </Tooltip>
    );
  } else {
    return (
      <a href={link} title={link} target={target}>
        {text}
      </a>
    );
  }
};

export default EllipsisLink;
