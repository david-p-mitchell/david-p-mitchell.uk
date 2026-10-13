---
title: "If my people who are called by my name"
verse: "2 Chronicles 7:14"
date: 2026-10-04
showAfterDate: 2026-10-04
summary: "If my people who are called by my name"
code: |
    God.People = Called(people, God.Name);
    var actions = new List>() 
    { 
        person => Humble(person), 
        person => person.Pray(), 
        person => person.Seek(God.Face), 
        person => person.Repent(Ways.OfType<Wicked>()) 
    };

    if (God.People.All(person => 
            actions.All(action => action(person))))
    {
        God.Hears();
        God.Forgives(God.People);
        God.Heals(God.People.Land);
    }
---
//Awaiting my thoughts on this verse.