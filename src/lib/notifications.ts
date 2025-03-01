import { supabase } from './supabase';

export interface NotificationPreferences {
  class_reminders: boolean;
  promotions: boolean;
  tournaments: boolean;
  announcements: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  class_reminders: true,
  promotions: true,
  tournaments: true,
  announcements: true,
  email_enabled: true,
  push_enabled: true,
};

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle(); // Use maybeSingle instead of single to handle no rows case

    if (error) throw error;

    // If no preferences exist, create default preferences
    if (!data) {
      const { error: insertError } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: user.id,
          ...DEFAULT_PREFERENCES
        });

      if (insertError) throw insertError;
      return DEFAULT_PREFERENCES;
    }

    return data;
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    throw new Error('Failed to get notification preferences');
  }
}

export async function updateNotificationPreferences(preferences: Partial<NotificationPreferences>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw new Error('Failed to update notification preferences');
  }
}