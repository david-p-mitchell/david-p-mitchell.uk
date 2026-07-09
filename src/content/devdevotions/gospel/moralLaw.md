public abstract class WorshipTarget { }

// How God has revealed Himself
public interface IRepresentationOfGod { }

public partial sealed class God : WorshipTarget, IRepresentationOfGod {
    public static God Instance { get; } = new();

    private God()
    {
    }
 }

public abstractclass Idol : WorshipTarget { }

public class Money : Idol { }
public class Career : Idol { }
//Etcetera

public class MoralCommandments
{

    bool IsRightWorship(WorshipTarget target)
    {
        if (target is not God)
            throw new InvalidOperationException(
                "You shall have no other gods before Me.");
        return true;
    }

    bool IsRightWorship(IRepresentationOfGod god)
    {
        if (god.GetType() != typeof(God))
        {
            throw new InvalidOperationException(
                "You shall not make for yourself an idol.");
        }
        return true;
    }

    bool UsesGodsNameTruthfully(Person person)
    {
        if(person.Statement.StartsWith("God told me") && !ScriptureConfirms(person.Statement)) return false;
        if(person.ProfessesFaithIn<God>() && !person.LifeReflectsProfession()) return false;
        return true;
    }

    public bool HonoursSabbath(Person person, DateTime date, RedemptiveEra era)
    {
        // The moral principle remains:
        // one day in seven belongs to the Lord.
        if (date.DayOfWeek != GetDayOfRest(era))
            return true;

        return IsDayKeptHoly(person, date);
    }

    private static DayOfWeek GetDayOfRest(RedemptiveEra era) =>
        era switch
        {
            RedemptiveEra.BeforeResurrection => DayOfWeek.Saturday, // The seventh day under the Old Covenant.
            RedemptiveEra.AfterResurrection => DayOfWeek.Sunday, // The first day of the week following Christ's resurrection.
            _ => throw new ArgumentOutOfRangeException(nameof(era))
        };

    private bool IsDayKeptHoly(Person person, DateTime date)
    {
        return
            person.RestedFromOrdinaryWork(date) &&
            person.GatheredForPublicWorship(date) &&
            person.DelightedInTheLord(date) &&
            person.SetApartDayForTheLord(date);
    }
    
}