import React from 'react';
import ReactEcharts from 'echarts-for-react';

const Echarts = (props) => {
  const { option } = props;
  return option ? (
    <ReactEcharts {...props} />
  ) : (
    <div
      {...props}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <span>暂无数据</span>
    </div>
  );
};

export default Echarts;