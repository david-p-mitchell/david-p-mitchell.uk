---
title: "Exodus 20v3: No other gods before/besides me."
verse: "Exodus 20:3"
date: 2026-07-15
summary: "No other gods before/besides me"
code: |
    public abstract class WorshipTarget { }
    public interface IClaimsToBeGod { }
    
    public partial sealed class God : WorshipTarget, IClaimsToBeGod 
    { 
        //not saying there is a new God here.
        public static God Instance { get; } = new(); 
        private God() { } 
    }

    public class Idol : WorshipTarget, IClaimsToBeGod { }
    
    public partial class FirstCommandment: MoralCommandment, IMoralCommandment 
    { 
        bool IsRightWorship(WorshipTarget target) 
        {
            if (!ReferenceEquals(target, God.Instance)) 
                throw new InvalidOperationException(
                    "You shall have no other gods before/besides Me."
                    ); 
            return true; 
        }
        bool IsRightWorship(WorshipTarget[] targets) 
        {
            if (targets.Length != 1)
                throw new InvalidOperationException(
                    "Worship cannot be divided."); //Matthew 6:24
            return IsRightWorship(targets[0]);
        }
    }
---
# No God but one!
----
<br />

After God had brought and rescued his people out the slavery in Egypt, he gives them some revelation on what he is like and what is for their good.

He is absolutely concerned about who/what we worship.

The well known John Calvin quote seems to come to mind: "Man's nature, so to speak, is a perpetual factory of idols."

We can not help, but worship something or someone, we were made to do so. Before the fall we were blissfully worshipping the Lord God in the garden.

After the fall of humanity, in our sinful state, we often worship what our natural hearts desire.

### What occupies your...
    - Thoughts?
    - Time?
    - Money?

<br />

### **What do you most often talk about**?
<br />

The answers to these questions, often reveal where our hearts are and ultimately what/ who we worship.

In the words of the Lord Jesus on the Sermon on the Mount, "For where your treasure is, there your heart will be also." - Matthew 6:21

Maybe you've been fond of keeping a git repo updated, or being the quickest to an update/ patch fix.

Idols are often extensions of our own selves and what we desire or want to become.

Consider today, where/who/what is your ```"WorshipTarget"```?

May we come to the True and living God, who is worthy of all our Worship and point other hearts towards him.

