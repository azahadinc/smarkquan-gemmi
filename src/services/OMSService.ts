import { Order, OrderStatus, OrderType, OrderSide } from '../types';

export class OMSService {
  private orders: Map<string, Order> = new Map();

  /**
   * Place a new order
   */
  public placeOrder(order: Omit<Order, 'id' | 'status' | 'timestamp'>): Order {
    const newOrder: Order = {
      ...order,
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      status: 'PENDING',
      timestamp: Date.now(),
    };

    this.orders.set(newOrder.id, newOrder);
    console.log(`Order placed: ${newOrder.type} ${newOrder.side} ${newOrder.quantity} @ ${newOrder.price || 'MKT'}`);
    
    return newOrder;
  }

  /**
   * Process orders against current market price
   */
  public processOrders(symbol: string, currentPrice: number): Order[] {
    const filledOrders: Order[] = [];

    this.orders.forEach((order) => {
      if (order.symbol !== symbol || order.status !== 'PENDING') return;

      let shouldFill = false;

      switch (order.type) {
        case 'LIMIT':
          if (order.side === 'BUY' && currentPrice <= order.price!) shouldFill = true;
          if (order.side === 'SELL' && currentPrice >= order.price!) shouldFill = true;
          break;
        case 'STOP_LOSS':
          if (order.side === 'BUY' && currentPrice >= order.stopPrice!) shouldFill = true;
          if (order.side === 'SELL' && currentPrice <= order.stopPrice!) shouldFill = true;
          break;
        case 'TRAILING_STOP':
          // Simplified trailing stop logic
          // In real implementation, we'd track the peak/trough price
          if (order.side === 'SELL' && currentPrice <= (order.stopPrice || 0)) shouldFill = true;
          break;
        case 'MARKET':
          shouldFill = true;
          break;
      }

      if (shouldFill) {
        order.status = 'FILLED';
        filledOrders.push({ ...order });

        // Handle OCO logic
        if (order.linkedOrderId) {
          const linkedOrder = this.orders.get(order.linkedOrderId);
          if (linkedOrder && linkedOrder.status === 'PENDING') {
            linkedOrder.status = 'CANCELLED';
          }
        }
      }
    });

    return filledOrders;
  }

  public getOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  public cancelOrder(orderId: string): boolean {
    const order = this.orders.get(orderId);
    if (order && order.status === 'PENDING') {
      order.status = 'CANCELLED';
      return true;
    }
    return false;
  }
}

export const omsService = new OMSService();
