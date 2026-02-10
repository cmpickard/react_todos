## TO BE DONE
+ group todos into date-based categories
+ create NAV bar

## Components

+ `header`: List names + items-count
  - updates as todo-count changes
  - name changes based on "current" category / list being actively viewed
    - current category defaults to "All Todos" (get all on initial load)

+ `main`: primary area displaying items of a todo list
  - label: 
    - event: onClick
    - show modal
    - `<label>` + `<img>`
    - styling + event listener
  
  + **list**: table / `<ul>`
    - children **todo item**
  
    + **todo item**
      - name, date: `"<name> - <date>"`
        - `<date>`: "No Due Date" if not *both* "month" && "year"
      - click to edit
        - handle: bring up the 'edit' modal
      - click to toggle complete
      - click to delete


+ `modal`: create new or edit existing item
  - initially hidden, displays on `add`/`exit` anchor
  - modaldiv: controls display
    - event: onClick
    - handle: hide modal (`display: none`)
  - form
    - input: type="text" (controlled)
      -labelled: Title
      -must be 3+ chars
    - div:
      -labelled: Due Date
      -select: day (controlled)
        -options: "Day" and 1 through 31
      -select: month (controlled)
        -options: "Month" and January through December
      -select: year (controlled)
        -options: "Year" and 2014 through 2025
    - textarea (controlled)
      -labelled: Description
    - button: "mark complete"
      - event: submit
      - handle: if new **todo**, cannot mark complete
    - submit: "Save"
      - handle: if todo is less than 3 chars throw alert
      - no other validation -- no due date or description required
    - can be pulled up EITHER by click event on "Add New Todo" or by click event
    on an existing todo. In the latter case, the modal is auto-populated with
    info about the clicked todo item

## Structure

```jsx
<Header/>
<MainContent>
  <AddTodoLabel>
  <TodoList>
    <TodoItem>
      <ToggleDoneButton/>
      <TodoDescription/>
      <TodoEdit>
      <TodoDelete/>
    </TodoItem>...
  </TodoList>
  <AddTodoModal>
    <AddTodoForm>
      <NameInput>
      <Date>
        <DaySelect>
        <MonthSelect>
        <YearSelect>
      <Description>
      <SaveTodoButton>
      <MarkCompleteButton> 
    </AddTodoForm>
  </AddTodoModal>
</MainContent>
```
