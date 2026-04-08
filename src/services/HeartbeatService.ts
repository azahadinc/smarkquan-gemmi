import { EventEmitter } from 'events';

export class HeartbeatService extends EventEmitter {
  private lastHeartbeat: number = Date.now();
  private checkInterval: number = 5000; // Check every 5 seconds
  private timeoutThreshold: number = 15000; // 15 seconds timeout
  private isConnected: boolean = true;

  constructor() {
    super();
    this.startMonitoring();
  }

  /**
   * Record a heartbeat from the exchange or network
   */
  public recordHeartbeat() {
    this.lastHeartbeat = Date.now();
    if (!this.isConnected) {
      this.isConnected = true;
      this.emit('reconnected');
      console.log('Connectivity restored');
    }
  }

  private startMonitoring() {
    setInterval(() => {
      const now = Date.now();
      if (now - this.lastHeartbeat > this.timeoutThreshold) {
        if (this.isConnected) {
          this.isConnected = false;
          this.emit('disconnected');
          this.handleDisconnect();
        }
      }
    }, this.checkInterval);
  }

  private handleDisconnect() {
    console.error('CRITICAL: Connectivity lost! Initiating fail-safe protocols...');
    
    // Fail-safe actions:
    // 1. Flatten positions (Simulated)
    this.emit('fail-safe:flatten');
    
    // 2. Alert via external channels (Simulated Telegram/Discord)
    this.sendAlert('CRITICAL: Connectivity lost. All positions are being flattened for safety.');
  }

  private sendAlert(message: string) {
    // In a real app, this would call a Telegram/Discord webhook
    console.log(`[ALERT SENT]: ${message}`);
  }

  public getStatus() {
    return {
      isConnected: this.isConnected,
      lastHeartbeat: new Date(this.lastHeartbeat).toISOString()
    };
  }
}

export const heartbeatService = new HeartbeatService();
