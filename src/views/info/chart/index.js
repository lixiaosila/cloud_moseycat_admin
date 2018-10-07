import React,{Component} from 'react'
import { Row ,Col, Card } from 'antd'

import {
  Chart,
  Geom,
  Axis,
  Tooltip
} from "bizcharts";

import { getCharts } from '@/server'

class ChartShow extends Component {
    state = {
        data: [],
        count: 1,
        last30DayCount: 1
    }
    componentDidMount() {
        this.getChart();
    }
    getChart() {
        getCharts().then(
            res => {
                if(res.code == 1) {
                    this.setState(
                        {
                            data: res.data.chart,
                            count: res.data.count,
                            last30DayCount: res.data.last30DayCount
                        }
                    )
                }
                
            }
        )
    }
    renderChart = (data) => {
        let tpl = '<li data-index={index}>'
                + '<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>'
                + '{name}: {value}'
                + '</li>';
        return (
            <Chart height={window.innerHeight} data={data} forceFit>
                <Axis name="day" />
                <Axis name="count" />
                <Tooltip
                    title="test"
                    containerTpl="<div class=&quot;g2-tooltip&quot;><p class=&quot;g2-tooltip-title&quot;></p><ul class=&quot;g2-tooltip-list&quot;></ul></div>"
                    itemTpl= {tpl}
                    offset={50}
                    g2-tooltip={{
                        position: "absolute",
                        visibility: "hidden",
                        border: "1px solid #efefef",
                        backgroundColor: "white",
                        color: "#000",
                        opacity: "0.8",
                        padding: "5px 15px",
                        transition: "top 200ms,left 200ms"
                    }}
                    g2-tooltip-list={{
                        margin: "10px"
                    }}
                />
                <Geom tooltip={['day*count', (time, sold) => {
                    return {
                        //自定义 tooltip 上显示的 title 显示内容等。
                        name: '提交订单数：',
                        title: '当前日期：' + time,
                        value: sold
                    };
                }]} type="line" position="day*count" shape="smooth"/>
            </Chart>
        )
    }
    render() {
        let { data, count, last30DayCount } = this.state;
        
        return (
            <div style={{background: '#fff'}}>
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title="总订单数" bordered={false}>{count}</Card>
                        </Col>
                        <Col span={8}>
                            <Card title="最近30日总订单数" bordered={false}>{last30DayCount}</Card>
                        </Col>
                    </Row>
                </div>
                <div style={{overflow: 'hidden'}}>
                    <h2 style={{margin: '30px 50px', fontSize: '18px' }}>
                        最近30日订单分析
                    </h2>
                </div>
                {
                    data.length > 0 && this.renderChart(data)
                }
            </div>
        );
    }
}

export default ChartShow;
