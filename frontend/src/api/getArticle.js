import { createClient } from 'contentful';

console.log('REACT_APP_CONTENTFUL_SPACE_ID:', process.env.REACT_APP_CONTENTFUL_SPACE_ID);
console.log('REACT_APP_CONTENTFUL_DELIVERY_TOKEN:', process.env.REACT_APP_CONTENTFUL_DELIVERY_TOKEN);

const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_DELIVERY_TOKEN,
});

export const getArticles = async () => {
  try {
    const entries = await client.getEntries({ content_type: 'blogPost' });
    return entries.items;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

export const getFeaturedArticles = async () => {
  try {
    const entries = await client.getEntries({ content_type: 'blogPost' });
    return entries.items.filter(item => item.fields.isFeatured === true);
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return [];
  }
};
