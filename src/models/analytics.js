// time reqquired, most active user, most popular category, total placemarks, placemarks per user, etc.

export const analyticsUtils = {
  // This function takes two arrays as input and returns a formatted stats object
  generateStats(allPlacemarks, allUsers) {
    const totalPlacemarks = allPlacemarks.length;
    const totalUsers = allUsers.length;

    // Category summary, reduce the array of placemarks to a count of each category, then sort by count
    const categoryMap = allPlacemarks.reduce((acc, p) => {
      // if category exists, increment count, otherwise initialise to 0
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    const categoryCounts = Object.keys(categoryMap).map(cat => ({
      _id: cat,
      count: categoryMap[cat]
    })).sort((a, b) => b.count - a.count);

    // Count how many placemarks each user has created
    const userCounts = allPlacemarks.reduce((acc, p) => {
      acc[p.userId] = (acc[p.userId] || 0) + 1;
      return acc;
    }, {});

    // map the user counts to an array of user objects with their name and count, then sort by count and take the top 5
    const activeUsers = allUsers.map(user => ({
      firstName: user.firstName,
      lastName: user.lastName,
      count: userCounts[user._id] || 0
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    const recentPlacemarks = allPlacemarks.slice(-5).reverse();
    
    return {
      totalPlacemarks,
      totalUsers,
      categoryCounts,
      activeUsers,
      recentPlacemarks,
    };
  }
};
