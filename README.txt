Before you continue, make sure you have a server running or a local host set up on your machine. 

This application allows an experimenter to present set(s) of experimental blocks of trials to a user. This application has 6 predefined “sub-event” types that can be combined to design the events of a trial. The sub-events and their required "key" settings are:
  - Clear:                                  Clears object(s) on screen
    ○ "which":                                  Array with the ids of the objects you would like to remove from screen ([id1, id2, …, idn] or ["all"] for all).
  - Timed:                                  Lasts a period of time 
    ○ "duration":                               Length of time in milliseconds (e.g 6000)
  - Key:                                    Lasts until key press
    ○ "press":                                  In array form, which keys are acceptable ([key1, key2, …, keyn])
  - TimedKey:                               Lasts period of time listening for a key press
    ○ "duration":                               
    ○ "press":                                  
  - TimedOrKey:                             Lasts a period of time or until key press
    ○ "duration":                               
    ○ "press":                                  
  - Feedback:                               dependent on action of user in previous subevent, mimicks defined subevent
    ○ "mimicks":                                 which subevent you want to mimic (e.g. "Timed")
    ○ And requirements of the subevent it is mimicking    

This application has an example provided inside "experiments/example" with the sample block, "experiments/example/blocks/block1.json". The sample block consists of 1 trial with 3 events made up of 6 sub-events. Below is each event and how it is presented:
  1. Present a situation for 2 seconds
     sub-event: "Timed" with "duration" 2000 (time in milliseconds) presents the jpeg of the situation 
  2. Present an image of a person with a neutral expression and possible expression reactions to the situation by that person that correspond to key presses. The user is to choose the response he/she thinks fits best within 6 seconds
     sub-event: "Timed" with "duration" 0 presents the jpeg of the neutral expression
     sub-event: "TimedOrKey" with "duration" 6000 and "press" [65, 97, 68, 100, 70, 102, 83, 115] presents the jpeg with the options for the answer and sets the allowed key presses
  3. If the person chooses the correct answer, the options are cleared and the trial continues. If the person chooses the incorrect answer, the options are cleared and the correct answer is presented in place of the neutral expression.
     sub-event: "mimicks" sub-event type "Clear" with "press" [65, 97, 70, 102, 83, 115]. "which" is ["F01-Surprise.png"]
     sub-event: "mimicks" sub-event type "Clear" with "press" [68, 100]. "which" is ["F01-Surprise.png", "F01-Neutral.jpg"]
     sub-event: "mimicks" sub-event type "Timed" with "press" [68, 100]. "Duration" is 2000

------------------------------------------------------------------------------------------
The master directory only contains "src" by default, which contains the web application library. For all intents and purposes I will refer to the master directory as "master".
Overview:
  - "src/functions/":           Contains all functions used. User will probably only need to edit "experiment.js"

------------------------------------------------------------------------------------------
You must provide the program your experimental folder structure in the "settings.json" file, stimuli within folders (mostly) of your choice defined in "settings.json", and the experimental block designs as JSON objects in your "blocks" directory, again, defined in "settings.json" 
JSON objects are heavily employed in this application. JSON objects are data structure composed of "keys" and corresponding "values" -- this relationshp is similar to the key-value relationship of maps in C++ or field-value relationship of structs in MatLab. This Wikipedia article provides a good introduction to JSON objects: 
        http://en.wikipedia.org/wiki/JSON
You can use, "http://jsonlint.com/" to check that your json object is properly written. 

------------------------------------------------------------------------------------------
An example experiment can be found inside "experiments/example/". It uses the settings found in the "settings.json" by default. 

------------------------------------------------------------------------------------------
Structuring your "settings.json":
  This file contains a JSON object. The default JSON object is:
  {
    "primary" : "experiments/example/",
    "image" : "stimuli/image/",                            
    "audio" : "stimuli/audio/",
    "video" : "stimuli/video/",
    "text" : "stimuli/text/",
    "html" : "html/",
    "blocks" : "blocks/",
    "results" : "results/"
  }

  For example, the "image" directory would be "master/experiments/first/stimuli/image/"  (please remember to place a backslash at the end of each directory).
  You must provide the following keys:
  - "primary":            The main directory of your experiment -- all other directories are relative to this directory.
  - "html":               Where html files are stored.
  - "blocks":             Where experimental blocks are stored.
  - "results""            Where the results of the experimental blocks are stored.
  Note: Both "blocks," and "html" require an "order.txt" file which contains the order of the experimental blocks, and of the primary instructions, respectively. Instructions corresponding to the blocks are not required in this file; they should be defined in the JSON object of their corresponding experimental block.
  You may add as many directories (each with a corresponding key) as you desire.



------------------------------------------------------------------------------------------
Setting up an experimental block as a JSON object:
Note: The dimensions of the experiment window are 800 x 600. Plan your experiment around that.

This json object has 3 main keys (all of which are required): "instructions," "randomize," and "Trials". 
Block:
{ 
  instructions: []         Array of html files that will present the instructions for this block (as strings)
  randomize: Boolean        True if you would like to randomize the trial presentation order
  Trials:                   A 2-D array of the trials
  [
    [                         Trial 1 (each trials is 1-D arrays of subevents)
      {},                     subevent 1 (each subevent is a json object that produces some behavior in the experiment)
      {},                     subevent 2
      ..., 
      {}                      subevent n
    ],
    [ {}, {}, ..., {} ],      Trial 2
    ...
    [ {}, {}, ..., {} ]       Trial m
  ]
}

Each sub-event (with the exception of "clear") is capable of presenting an object (media or text) to the user
For each sub-event, the following keys are required:
  - "eventType":                            6 predefined choices (can add your own)
  - "filename," if object presented is a file or "id," if otherwise
  - "type":                                 "media" or "text"
  - "tag":                                  HTML tag (e.g. img, audio, p, center, etc.)
  - "x":                                    x coordinate relative to left most edge
  - "y":                                    y coordiante relative to top most edge
  - "width":                                desired width of object. default options:
                                              ○ Not defined - preserves
                                              ○ "default" = 300px