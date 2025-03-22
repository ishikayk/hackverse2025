export interface Resource {
    id: string;
    title: string;
    type: 'Video' | 'Written' | 'Project' | 'Exercises';
    duration: string;
    icon: React.ReactNode;
 }
  
export interface Topic {
    id: number;
    title: string;
    resources: Resource[];
} 

export interface Stats {
  progress: number;
  streak: number;
  timeInvested: number;
}

export interface Achievements {
  name: string;
  status: 'completed' | 'ongoing';
  date: string;
}