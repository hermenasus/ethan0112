export interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description?: string;
}

export interface ConsultingTopic {
  title: string;
  description: string;
  bullets: string[];
}

export interface MediaItem {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
}

export interface Review {
  name: string;
  date: string;
  content: string;
  rating?: number;
}
