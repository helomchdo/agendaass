import { supabase } from './supabaseclient.js';

console.log('API Service Loaded');

// Event API functions
export const eventAPI = {
    // Get all events from Supabase directly
    getAllEvents: async () => {
        console.log('Fetching events from Supabase...');
        try {
            const { data, error } = await supabase
                .from('solicitacoes')
                .select('*')
                .order('date', { ascending: true });

            console.log('Supabase response:', { data, error });

            if (error) {
                console.error('Error fetching events:', error);
                throw error;
            }
            
            if (!data) {
                console.log('No events found');
                return [];
            }

            console.log('Raw events data:', data);
            
            // Transform the data to match the expected format
            const transformedEvents = data.map(event => ({
                id: event.id,
                title: event.subject || 'Sem título',
                date: event.date,
                dateTime: event.date, // For daily view
                location: event.location,
                status: event.status,
                sei_number: event.sei_number,
                send_date: event.send_date,
                requester: event.requester,
                focal_point: event.focal_point,
                sei_request: event.sei_request
            }));

            console.log('Transformed events:', transformedEvents);
            return transformedEvents;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    },

    // Create a new event
    createEvent: async (eventData) => {
        try {
            const { data, error } = await supabase
                .from('solicitacoes')
                .insert([eventData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    },

    // Update an event
    updateEvent: async (eventId, eventData) => {
        try {
            const { data, error } = await supabase
                .from('solicitacoes')
                .update(eventData)
                .eq('id', eventId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    },

    // Delete an event
    deleteEvent: async (eventId) => {
        try {
            const { error } = await supabase
                .from('solicitacoes')
                .delete()
                .eq('id', eventId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }
};
