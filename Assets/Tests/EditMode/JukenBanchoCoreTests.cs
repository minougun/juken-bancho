using System.Collections.Generic;
using JukenBancho.Core;
using NUnit.Framework;

namespace JukenBancho.Tests
{
    public sealed class JukenBanchoCoreTests
    {
        [Test]
        public void StudyCardRaisesAcademicsAndAdvancesTurn()
        {
            GameState state = DefaultContent.CreateInitialState();
            CardData study = FindCard("study_library");

            TurnResult result = new TurnResolver().ApplyCard(
                state,
                study,
                new List<RandomEventData>(),
                new FixedRandomSource(1f));

            Assert.IsTrue(result.Success);
            Assert.AreEqual(1, result.State.Turn);
            Assert.Greater(result.State.Stats.Academics, state.Stats.Academics);
            Assert.Less(result.State.Stats.Stamina, state.Stats.Stamina);
        }

        [Test]
        public void LowStaminaBlocksFightCardWithoutAdvancingTurn()
        {
            GameState state = DefaultContent.CreateInitialState();
            state.Stats.Stamina = 5;
            CardData fight = FindCard("rescue_fight");

            TurnResult result = new TurnResolver().ApplyCard(
                state,
                fight,
                new List<RandomEventData>(),
                new FixedRandomSource(1f));

            Assert.IsFalse(result.Success);
            Assert.AreEqual(0, result.State.Turn);
            Assert.AreEqual(5, result.State.Stats.Stamina);
        }

        [Test]
        public void OneShotCardCannotBeUsedTwice()
        {
            GameState state = DefaultContent.CreateInitialState();
            state.Turn = 5;
            CardData mockExam = FindCard("mock_exam");
            var resolver = new TurnResolver();

            TurnResult first = resolver.ApplyCard(
                state,
                mockExam,
                new List<RandomEventData>(),
                new FixedRandomSource(1f));
            TurnResult second = resolver.ApplyCard(
                first.State,
                mockExam,
                new List<RandomEventData>(),
                new FixedRandomSource(1f));

            Assert.IsTrue(first.Success);
            Assert.IsFalse(second.Success);
            Assert.AreEqual(first.State.Turn, second.State.Turn);
        }

        [Test]
        public void PassingWithTrustAndFaceProducesBanchoEnding()
        {
            GameState state = DefaultContent.CreateInitialState();
            state.IsComplete = true;
            state.Stats = new StatBlock(80, 55, 55, 30, 45);

            EndingResult ending = new EndingResolver().Resolve(state);

            Assert.AreEqual("passed_bancho", ending.Id);
        }

        [Test]
        public void PassingWithoutRelationshipsProducesLonelyEnding()
        {
            GameState state = DefaultContent.CreateInitialState();
            state.IsComplete = true;
            state.Stats = new StatBlock(82, 20, 30, 40, 60);

            EndingResult ending = new EndingResolver().Resolve(state);

            Assert.AreEqual("lonely_pass", ending.Id);
        }

        [Test]
        public void AvailableCardsExcludeLockedAndUnaffordableCards()
        {
            GameState state = DefaultContent.CreateInitialState();
            state.Turn = 1;
            state.Stats.Stamina = 10;

            List<CardData> available = DefaultContent.GetAvailableCards(state, DefaultContent.CreateCards());

            Assert.IsFalse(ContainsCard(available, "mock_exam"));
            Assert.IsFalse(ContainsCard(available, "rescue_fight"));
            Assert.IsTrue(ContainsCard(available, "sleep_early"));
        }

        private static CardData FindCard(string id)
        {
            List<CardData> cards = DefaultContent.CreateCards();
            for (int i = 0; i < cards.Count; i++)
            {
                if (cards[i].Id == id)
                {
                    return cards[i];
                }
            }

            Assert.Fail("Missing card: " + id);
            return null;
        }

        private static bool ContainsCard(List<CardData> cards, string id)
        {
            for (int i = 0; i < cards.Count; i++)
            {
                if (cards[i].Id == id)
                {
                    return true;
                }
            }

            return false;
        }
    }
}
