import { supabase } from "@/integrations/supabase/client";

export interface RealtimeMessage {
  type: string;
  text?: string;
  transcript?: string;
  [key: string]: unknown;
}

export class RealtimeChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private localStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;

  constructor(private onMessage: (message: RealtimeMessage) => void) {
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
  }

  async init(): Promise<void> {
    try {
      console.log("Initializing realtime chat...");
      
      // Get ephemeral token from our edge function
      const { data, error } = await supabase.functions.invoke("openai-realtime-token");
      
      if (error) {
        console.error("Error getting token:", error);
        throw new Error(`Failed to get ephemeral token: ${error.message}`);
      }

      if (!data?.client_secret?.value) {
        console.error("No client_secret in response:", data);
        throw new Error("Failed to get ephemeral token - no client_secret received");
      }

      const EPHEMERAL_KEY = data.client_secret.value;
      console.log("Got ephemeral key, setting up WebRTC...");

      // Create peer connection
      this.pc = new RTCPeerConnection();

      // Set up remote audio with analyser for visualization
      this.pc.ontrack = (e) => {
        console.log("Received remote audio track");
        this.audioEl.srcObject = e.streams[0];
        
        // Create audio context and analyser for visualization
        this.audioContext = new AudioContext();
        const source = this.audioContext.createMediaStreamSource(e.streams[0]);
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = 256;
        this.analyserNode.smoothingTimeConstant = 0.8;
        source.connect(this.analyserNode);
        
        // Also connect to destination to hear the audio
        // Note: Audio plays through audioEl, analyser just observes
        console.log("Audio analyser connected for visualization");
      };

      // Add local audio track
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      this.pc.addTrack(this.localStream.getTracks()[0]);
      console.log("Added local audio track");

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.addEventListener("message", (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log("Received event:", event.type);
          this.onMessage(event);
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      });

      this.dc.addEventListener("open", () => {
        console.log("Data channel opened");
      });

      this.dc.addEventListener("close", () => {
        console.log("Data channel closed");
      });

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      console.log("Created local offer");

      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error("SDP response error:", sdpResponse.status, errorText);
        throw new Error(`Failed to connect to OpenAI: ${sdpResponse.status}`);
      }

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("WebRTC connection established successfully");

    } catch (error) {
      console.error("Error initializing chat:", error);
      this.disconnect();
      throw error;
    }
  }

  sendMessage(text: string): void {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Data channel not ready');
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    this.dc.send(JSON.stringify(event));
    this.dc.send(JSON.stringify({ type: 'response.create' }));
  }

  disconnect(): void {
    console.log("Disconnecting realtime chat...");
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }
    
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyserNode = null;
    }
    
    this.audioEl.srcObject = null;
    console.log("Disconnected");
  }

  isConnected(): boolean {
    return this.dc?.readyState === 'open';
  }

  getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }
}
