*** Patrick Shannon / 12/12/17 ***

# Space-Idle-Trade Proposal

## What is Space-Idle-Trade?
> It's an attempt to merge two very niche game genres into one terrible game because I think I can do it. A idle game is a game that plays itself, and a space trading game is a game that focuses on economic development while dealing with the perils of being in space. I want to create an experience where people can cooperate with each other to watch arbituary numbers go up!
- (Brief description of the game, why you're choosing to make it)

## Wireframe
> <WIP>
- (Your wireframes go here. Preferably two or more)

## Initial thoughts on game structure
> Going to have quite a bit of tables, but I'm only worried about 3; Users, regions, and resources. Users can occupy regions, regions have resources, and those resources can be sold for money... or something. I know MVP is going to be really REALLY small since I'm going to be doing this with rails and react and I'm VERY weak with ruby. Users will also be able to send messages so that's going to be another table. Trading going to be another table. Honestly the hardest part will be actually getting the f*&!ing rails play nice. If I can do that, then I'm sure implementing the other tables using active record will go really quickly. To reiterate
- (Write out what challenges you expect to encounter, or ideas you want to come up with)

## Phases of Completion
### Phase -3
1. Users can register
2. Users can log in
3. Users can log out
4. The backend api can receive requests and respond to them appropriately
5. Users can increment a count from the front end
6. That count can be saved to that user's data in the database
7. Users can continue counting where they left off

### Phase -2
1. Regions exist
2. Regions can be occupied by users
3. Users can select a region
4. A resources table exist
5. Users can increment a count based on the region they're in
6. A region's resource count can deplete
7. The database records these changes in a timely manner

### Phase -1
1. User counts can decrement.
2. Users can purchase upgrades that let them increment the number automatically
3. That count will continue going up wether the user is logged in or not
4. Messages table exists
5. Users can send messages to each other
6. The GUI is positioned properly

### Phase 0
1. Users can delete messages in thier inbox
2. Users can make trade requests
3. Users can complete trade requests
4. The GUI isn't completely ugly


- (The steps or phases you expect to go through, and the tasks that you'll need to accomplish to reach each step. These should resemble the acceptance criteria we were working through earlier.)

## Technologies
- Rails back end
  - Auth
- React front end

## Links and Resources
- Something about scheduling
- Something about forgery protection
(Anything you've looked up so far or are thinking about using.)
