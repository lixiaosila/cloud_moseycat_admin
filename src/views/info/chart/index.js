import React,{Component} from 'react'
import {
  Chart,
  Geom,
  Axis,
  Tooltip
} from "bizcharts";

import { getCharts } from '@/server'

class ChartShow extends Component {
    state = {
        data: []
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
                            data: res.data
                        }
                    )
                }
                
            }
        )
    }
  render() {
    let { data } = this.state;
    return (
        <div style={{background: '#fff'}}>
            <div style={{overflow: 'hidden'}}>
                <h2 style={{margin: '30px 50px', fontSize: '18px' }}>
                    30日订单
                </h2>
            </div>
            <Chart height={window.innerHeight} data={data} forceFit>
                <Axis name="day" />
                <Axis name="count" />
                <Tooltip
                    containerTpl="<div class=&quot;g2-tooltip&quot;><p class=&quot;g2-tooltip-title&quot;></p><table class=&quot;g2-tooltip-list&quot;></table></div>"
                    itemTpl="<tr class=&quot;g2-tooltip-list-item&quot;><td style=&quot;color:{color}&quot;>{name}</td><td>{value}</td></tr>"
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
                <Geom type="line" position="day*count" />
            </Chart>
        </div>
    );
  }
}

export default ChartShow;
