---
title: "If you have been raised with Christ."
verse: "Colossians 3: 1-4"
date: 2026-08-24
summary: "If you have been raised with Christ!"
showAfterDate: "2026-08-24"
code: |
    var thingsAbove = things<Above>(); 
    if(you.HaveBeenRaisedWith(Christ))
    {
        you.Seek(thingsAbove);
        Christ.Location = thingsAbove;
        Christ.State = Seated(God.RightHand);

        you.Thoughts = you.SetMind(thingsAbove);
        you.Thoughts -= [... things<Earthly>()];
        you.State = LifeState.Dead;
        you.Life = Hidden(Christ, God);

        you.WhenAppears(Christ, () => 
        {
            you.State = LifeState.Glorified;
            you.AppearWith(Christ, Glory);
        });
        
    }


---
//Awaiting my thoughts on this verse.
