import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable, of } from 'rxjs';

const dummyChatResponse: ChatResponse = {
  "result": [
    {
      "developer_name": "Godrej Properties",
      "transaction_count": 2104
    },
    {
      "developer_name": null,
      "transaction_count": 1743
    },
    {
      "developer_name": "SD Corp",
      "transaction_count": 1578
    },
    {
      "developer_name": "Lokhandwala",
      "transaction_count": 857
    },
    {
      "developer_name": "Lodha Group",
      "transaction_count": 758
    }
  ],
  "is_graph": {
    "is_graph": "yes",
    "graph_type": "bar",
    "x-axis": "developer_name",
    "y-axis": "transaction_count"
  },
  "result_summary": "### Summary of Key Insights:\n\n- **Top Developer by Transactions**: Godrej Properties leads the list with a significant margin, recording 2,104 transactions. This indicates a strong market presence and possibly a high level of consumer trust or demand for their properties.\n\n- **Second Place**: SD Corp follows with 1,578 transactions. While they are the second highest, there is a notable gap of 526 transactions between them and Godrej Properties.\n\n- **Other Notable Developers**:\n  - Lokhandwala has recorded 857 transactions, placing them third on the list. This is a substantial drop from the second position, indicating a more moderate level of activity.\n  - Lodha Group, with 758 transactions, is close behind Lokhandwala, suggesting competitive activity levels between these two developers.\n\n- **Missing Data**: The results table only lists four developers, while the query was set to return five. This could imply that there is a significant drop-off in transaction counts after the fourth developer, or there may be a data retrieval issue.\n\nOverall, the data highlights Godrej Properties as the dominant player in terms of transaction volume, with a clear lead over other developers in the region.",
  "sql_query": "SELECT developer_name, COUNT(transaction_id) AS transaction_count\nFROM real_estate\nGROUP BY developer_name\nORDER BY transaction_count DESC\nLIMIT 5;",
}

export interface TimeSeriesDataPoint {
  [key: string]: string | number | null | undefined;
}

export interface GraphMetadata {
  is_graph: string;
  graph_type: string;
  'x-axis': string;
  'y-axis': string;
}
export interface ChatResponse {
  message?: string;
  timestamp?: string;
  result?: TimeSeriesDataPoint[];
  is_graph?: GraphMetadata;
  result_summary?: string;
  sql_query?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private apiService: ApiService) { }

  /**
   * Send a chat query to the backend
   * @param query The user's chat query
   * @returns Observable of the chat response
   */
  send(query: string): Observable<ChatResponse> {
    // return of(dummyChatResponse);
    // Validate the query
    if (!query || query.trim() === '') {
      throw new Error('Query cannot be empty');
    }


    // Use ApiService's generic get method
    return this.apiService.get<ChatResponse>(`/chat/send`, { query }, true);
  }

  /**
   * Process the chat response to determine if it contains graph data
   * @param response The response from the chat service
   * @returns An object with processed data ready for display
   */
  processResponse(response: ChatResponse): {
    isGraph: boolean;
    graphType?: string;
    graphData?: any[];
    xAxis?: string;
    yAxis?: string;
    summary?: string;
    message?: string;
  } {
    // Check if response contains graph data
    if (response.is_graph && response.is_graph.is_graph === 'yes' && response.result) {
      return {
        isGraph: true,
        graphType: response.is_graph.graph_type,
        graphData: response.result,
        xAxis: response.is_graph['x-axis'],
        yAxis: response.is_graph['y-axis'],
        summary: response.result_summary
      };
    }

    // Regular text response
    return {
      isGraph: false,
      message: response.message || response.result_summary || 'No response received'
    };
  }



}
