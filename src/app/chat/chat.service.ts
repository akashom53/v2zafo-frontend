import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';


interface TimeSeriesDataPoint {
  week_start: string;
  search_results_visits: number;
}

interface GraphMetadata {
  is_graph: string;
  graph_type: string;
  'x-axis': string;
  'y-axis': string;
}
interface ChatResponse {
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
