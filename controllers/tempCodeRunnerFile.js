 // Fetch the player's information directly within this function
    const player = await playerModel.findOne({ _id: playerId });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Extract the name and general information from the player object
    const { name, emailID, mobileNumber, location: playerLocation } = player;

    // Construct the playerInfo object
    const playerInfo = {
      name,
      emailID,
      mobileNumber,
      location: playerLocation,
    };