import { CommonModule, NgIf } from '@angular/common';
import { Component, computed, Input, OnInit, Signal } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChatResponse } from '../../../../chat/chat.service';

@Component({
  selector: 'app-bar-chart',
  imports: [CommonModule, BaseChartDirective, NgIf],
  templateUrl: './bar.chart.component.html',
  styleUrl: './bar.chart.component.css'
})
export class BarChartComponent implements OnInit {


  @Input() chatResponse?: ChatResponse;

  isChart: Signal<boolean> = computed(() => {
    return this.chatResponse?.is_graph?.is_graph === 'yes';
  });


  barChartType: Signal<ChartType> = computed(() => {
    return this.chatResponse?.is_graph?.graph_type === 'bar' ? 'bar' : 'line';
  });

  barChartData?: {
    labels: string[];
    datasets: { data: number[]; label: string }[];
  };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  underscoreToSpace(text: string): string {

    let ret = text.replace(/_/g, ' ');
    // capitalize first letter
    ret = ret.charAt(0).toUpperCase() + ret.slice(1);
    return ret;
  }

  ngOnInit(): void {
    if (this.isChart()) {
      const xAxis = this.chatResponse!.is_graph!['x-axis']
      const yAxis = this.chatResponse!.is_graph!['y-axis']
      let labels = this.chatResponse!.result!.map((item) => item[xAxis]?.toString() ?? 'N/A');
      const data = this.chatResponse!.result!.map((item) => (item[yAxis] as number));
      try {
        if (labels.length > 0) {
          const _d = new Date(labels[0]);
          if (!isNaN(_d.getTime())) {
            labels = labels.map((label) => {
              return new Date(label).toLocaleDateString();
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
      this.barChartData = {
        labels: labels,
        datasets: [
          { data: data, label: this.underscoreToSpace(yAxis) },
        ]
      };
    }
  }

}
