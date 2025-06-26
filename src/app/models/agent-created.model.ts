import { Agent } from './agent.model';

export interface AgentCreated {
  agent: Agent;
  motDePasseClair: string;
  id : Number;
}
