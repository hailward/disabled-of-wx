import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Layout,Progress } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import {
  CommonNavBar,
  ContainerWithCorner,
  GridLayout,
  ContainerWithBorder,
  CommonMap,
  RowChart
} from '../../components';
import {satisfactionCitywide,areaSatisfaction,areaEveryYear,areaDetail}from '../../service/index'
import StatisticsModal from './StatisticsModal';
import './index.scss';

const { Content } = Layout;

// 布局数据
const layout = [
  { i: '1-1', x: 0, y: 0, w: 6, h: 6 },
  { i: '1-2', x: 0, y: 5, w: 6, h: 18 },
  { i: '2-1', x: 6, y: 0, w: 12, h: 16 },
  { i: '2-2', x: 6, y: 16, w: 12, h: 8 },
  { i: '3-1', x: 18, y: 0, w: 6, h: 24 },
];


const Satisfaction = (props) => {
  // 统计数据
  const [tjData, setTjData] = useState([]);
  //选择地图的区域
  const [area, setArea] = useState()
  //各区平均满意度1
  const [everyArea1,setEveryArea1] = useState([])
  //各区平均满意度2
  const [everyArea2,setEveryArea2] = useState([])

  // echarts 图表
  const [echartsOptions, setEchartsOptions] = useState({
    // 机构满意度每年满意度变化趋势
    '2-2': {},
  });

  useEffect(() => {
    Promise.all([
      //全年办理总量
      new Promise((resolve)=>{
        satisfactionCitywide().then((res)=>{
          resolve(res)
        })
      }), 
      //各区的详细满意度
      new Promise((resolve)=>{
        areaDetail(area).then((res)=>{
          const data = [
            res.find((item)=>item.B7),
            res.find((item)=>item.B8),
            res.find((item)=>item.B9),
            res.find((item)=>item.B10),
            res.find((item)=>item.B11),
            res.find((item)=>item.B12),
            res.find((item)=>item.B13),
            res.find((item)=>item.B14),
            res.find((item)=>item.B15),
            res.find((item)=>item.B16),
            res.find((item)=>item.B17),
          ]
          setEveryArea1([
            {name:'对政府和社会各界对残疾人的关爱满意度',rate:data[0]?.B7,compare:`${data[0]?.往年同比增长}`.substring(1),compareStatus:`${data[0]?.往年同比增长}`.substring(0,1)==="-"?"down":'up'},
            {name:'对各级残联组织和设参工作部门的工作满意度',rate:data[1]?.B8,compare:`${data[1]?.往年同比增长}`.substring(1),compareStatus:`${data[1]?.往年同比增长}`.substring(0,1)==="-"?"down":'up'},
            {name:'残疾人信息核对人数占比情况',rate:data[2]?.B9,compare:`${data[2]?.往年同比增长}`.substring(1),compareStatus:`${data[2]?.往年同比增长}`.substring(0,1)==="-"?"down":'up'},
            {name:'需求反应是否及时反馈情况（反馈率）',rate:data[3]?.B10,compare:`${data[3]?.往年同比增长}`.substring(1),compareStatus:`${data[3]?.往年同比增长}`.substring(0,1)==="-"?"down":'up'},
            {name:'社区（村）开展残疾人文体生活满意度',rate:data[4]?.B11,compare:`${data[4]?.往年同比增长}`.substring(1),compareStatus:`${data[4]?.往年同比增长}`.substring(0,1)==="-"?"down":'up'},
          ])
          setEveryArea2([
            {name:'经过社会团体、单位或个人的帮扶人数占比',rate:data[5]?.B12,compare:`${data[5]?.往年同比增长}`.substring(1),compareStatus:`${data[5]?.往年同比增长}`.substring(0,1)==="-"?"down":'up'},
            {name:'惠残政策宣传率情况',rate:data[6]?.B13,compare:`${data[6]?.往年同比增长}`.substring(1),compareStatus:`${data[6]?.往年同比增长}`.substring(0,1)==="-"?"down":'up'},
            {name:'近几年来残疾人生活水平变化情况（提高率）',rate:data[7]?.B14,compare:`${data[7]?.往年同比增长}`.substring(1),compareStatus:`${data[7]?.往年同比增长}`.substring(0,1)==="-"?"down":'up'},
            {name:'残疾人平等参与社会生活的环境改善情况（改善率）',rate:data[8]?.B15,compare:`${data[8]?.往年同比增长}`.substring(1),compareStatus:`${data[8]?.往年同比增长}`.substring(0,1)==="-"?"down":'up'},
            {name:'惠残政策知晓率',rate:data[9]?.B16,compare:`${data[9]?.往年同比增长}`.substring(1),compareStatus:`${data[9]?.往年同比增长}`.substring(0,1)==="-"?"down":'up'},
            {name:'对街道、社区（村）提供的日常服务满意度',rate:data[10]?.B17,compare:`${data[10]?.往年同比增长}`.substring(1),compareStatus:`${data[10]?.往年同比增长}`.substring(0,1)==="-"?"down":'up'},
          ])
          resolve()
        })
      }),
      //机构满意度 每年满意度 变化趋势
      new Promise((resolve)=>{
        areaEveryYear().then((res)=>{
          resolve({
            grid: [
              {
                top: 10,
                right: 0,
                bottom: 0,
                left: 0,
                containLabel: true,
              }
            ],
            xAxis: [
              {
                type: 'category',
                axisLine: {
                  lineStyle: {
                    color: 'white'
                  }
                },
                boundaryGap: true,
                data: Object.keys(res)
              },
            ],
            tooltip: {
              trigger: 'axis',
            },
            yAxis: [
              {
                type: 'value',
                splitLine: {
                  show: false,
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: 'white'
                  }
                },
              },
            ],
            series: [
              {
                type: 'bar',
                name: '数值',
                data: Object.values(res),
              },
              {
                type: 'line',
                name: '数值',
                data:  Object.values(res),
              }
            ]
          })
        })
      }),
      //平均满意度
      new Promise((resolve)=>{
        areaSatisfaction().then((res)=>{
          resolve(res)
        })
      })
    ]).then((res)=>{
      setTjData([
        { title: "全市满意度", num: res[0].全市满意度 },
        { title: "往年满意度", num: res[0].往年满意度},
        { title: "同比增长",num: `${res[0].同比增长}`.substring(1), status: `${res[0].同比增长}`.substring(0,1)==="-"?'down':'up' },
      ])
      setEchartsOptions({...echartsOptions,'2-2':res[2]})
    })
  }, [area]);
  // 弹窗相关
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Layout className="satisfaction">
      <CommonNavBar showTime={true} title="满意度" btnType="back" />
      <ContainerWithCorner
        component={Content}
        className="satisfaction-content">
        <GridLayout layout={layout} margin={[5, 5]}>
          <ContainerWithBorder key="1-1" className="grid-item">
            <div className="grid-item-title">
              <span>残疾人满意度情况统计</span>
            </div>
            <div className="grid-item-content">
              {tjData.map((item, index) => {
                const key = index;
                return <div key={key} className="content-item">
                  <span className="item-num">{item.num}
                  {item.status === "up" ? <span className="item-scale text-green">↑{item.scale}</span> : item.status ? <span className="item-scale text-red">↓{item.scale}</span> : <span className="item-scale"></span>}             
                  </span>
                  <span className="item-title">{item.title}</span>
                </div>
              })}
            </div>
          </ContainerWithBorder>
          <ContainerWithBorder key="1-2" className="grid-item">
            <div className="grid-item-title">
              <span>{area}</span>
            </div>
            <div className="grid-item-content" style={{flexDirection:'column'}}>
              {
                everyArea1.map((item,index)=>{
                  return <div className="item-container">
                    <div className="item-left">
                      <div className="left-title"><span>NO.{index+1}</span>{item.name}</div>
                      <div className="left-num">
                        <Progress format={(percent)=>percent} percent={item.rate} strokeColor="#15CBE1" trailColor="#000717"></Progress>
                      </div>
                    </div>
                    <div className="item-right">
                      <div className={item.compareStatus === 'up'?'text-green':"text-red"}>{item.compare}%{item.compareStatus === 'up'?"↑":"↓"}</div>
                      <div>往年同比增长</div>
                    </div>
                  </div>
                })
              }
            </div>
          </ContainerWithBorder>
          <ContainerWithBorder key="2-1" className="grid-item">
            <CommonMap initData={0} callBack={(e) => { setArea(e.name) }}></CommonMap>
          </ContainerWithBorder>
          <ContainerWithBorder key="2-2" className="grid-item">
            <div className="grid-item-title">
              <span>机构满意度每年满意度变化趋势</span>
            </div>
            <ReactEcharts
              option={echartsOptions['2-2']}
              className="grid-item-content"
            />
            <div style={{ position: 'absolute', top: '20rem', right: '20rem' }}>
              <MenuOutlined
                onClick={() => setModalVisible(true)}
                style={{ fontSize: '1.5em' }}
              />
            </div>
          </ContainerWithBorder>
          <ContainerWithBorder key="3-1" className="grid-item">
            <div className="grid-item-title">
              <span>{area}</span>
            </div>
            <div className="grid-item-content" style={{flexDirection:'column'}}>
              {
                everyArea2.map((item,index)=>{
                  return <div className="item-container container-2">
                    <div className="item-left">
                      <div className="left-title"><span>NO.{index+6}</span>{item.name}</div>
                      <div className="left-num">
                        <Progress format={(percent)=>percent} percent={item.rate} strokeColor="#15CBE1" trailColor="#000717"></Progress>
                      </div>
                    </div>
                    <div className="item-right">
                      <div className={item.compareStatus === 'up'?'text-green':"text-red"}>{item.compare}%{item.compareStatus === 'up'?"↑":"↓"}</div>
                      <div>往年同比增长</div>
                    </div>
                  </div>
                })
              }
            </div>
          </ContainerWithBorder>
        </GridLayout>
      </ContainerWithCorner>
      <StatisticsModal
        visible={modalVisible}
        setVisible={setModalVisible}
      />
    </Layout>
  )
}

export default Satisfaction;