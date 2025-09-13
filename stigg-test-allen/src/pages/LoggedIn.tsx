import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import type { User } from '@supabase/supabase-js';

// API functions
async function addEvent(eventName: string, eventDescription: string) {
  const { error } = await supabase
    .from('events_duplicate')
    .insert([{ eventName, eventDescription }]);
  if (error) throw error;
}

async function getEvents() {
  const { data, error } = await supabase
    .from('events_duplicate')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Fetch products from your Supabase Edge Function
async function fetchProductsFromEdge(token: string) {
  // Replace with your actual deployed Edge Function URL
  const EDGE_URL = 'https://atgovymgtvgglrajrjjh.supabase.co/functions/v1/get-products';

  const res = await fetch(EDGE_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const responseData = await res.json();
  console.log('Edge function response:', responseData);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  const { products } = responseData;
  return products;
}

const LoggedIn = () => {
  const [user, setUser] = useState<User | null>(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data || []);
    } catch (err) {
      alert('Failed to fetch events');
    }
    setLoading(false);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !eventDescription) {
      alert('Please fill in both fields');
      return;
    }
    if (!user) {
      alert('User not found');
      return;
    }
    try {
      await addEvent(eventName, eventDescription);
      setEventName('');
      setEventDescription('');
      fetchEvents();
    } catch (err: any) {
      alert('Failed to add event: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Fetch products from Edge Function
  const handleFetchProducts = async () => {
    if (!user) {
      alert('User not found');
      return;
    }
    setLoadingProducts(true);
    try {
      // Get the current session's access token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('No access token found');
      const products = await fetchProductsFromEdge(token);
      setProducts(products);
    } catch (err: any) {
      alert('Failed to fetch products: ' + err.message);
    }
    setLoadingProducts(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome, {user?.email ?? 'User'}!</h1>
      <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Log Out
      </button>

      <div style={{ margin: '40px auto', maxWidth: 500 }}>
        <h2>Add Event</h2>
        <form onSubmit={handleAddEvent}>
          <div style={{ marginBottom: 8 }}>
            <input
              placeholder="Event Name"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <textarea
              placeholder="Event Description"
              value={eventDescription}
              onChange={e => setEventDescription(e.target.value)}
              style={{ width: '100%', padding: 8 }}
              rows={3}
            />
          </div>
          <button type="submit" style={{ padding: '8px 16px' }}>Add Event</button>
        </form>
      </div>

      <div style={{ margin: '40px auto', maxWidth: 700 }}>
        <h2>All Events</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Name</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Description</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Created By</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id}>
                  <td style={{ padding: 8 }}>{ev.eventName}</td>
                  <td style={{ padding: 8 }}>{ev.eventDescription}</td>
                  <td style={{ padding: 8 }}>{ev.createdBy}</td>
                  <td style={{ padding: 8 }}>{ev.created_at ? new Date(ev.created_at).toLocaleString() : ''}</td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 8 }}>No events yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ margin: '40px auto', maxWidth: 700 }}>
        <h2>Products</h2>
        <button onClick={handleFetchProducts} disabled={loadingProducts} style={{ marginBottom: 16 }}>
          {loadingProducts ? 'Loading...' : 'Fetch Products'}
        </button>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>ID</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Name</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Price</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {products.map((prod: any) => (
              <tr key={prod.id}>
                <td style={{ padding: 8 }}>{prod.id}</td>
                <td style={{ padding: 8 }}>{prod.productName}</td>
                <td style={{ padding: 8 }}>{prod.productPrice}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 8 }}>No products loaded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoggedIn;