using Xunit;
using backend;

namespace backend.tests;

public class UnitTest1
{
    [Fact]
    public void NewTask_ShouldNotBeCompleted()
    {
        var task = new TaskItem(); 

        task.Title = "Przetestować bezpiecznik";

        Assert.False(task.IsCompleted);
    }
}