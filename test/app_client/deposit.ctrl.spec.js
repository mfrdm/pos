describe ('Deposit controller', function (){

	describe ('Make a deposit', function (){
		it ('should show deposit form when click button `Make a deposit`')
		it ('should reset and hide deposit form when click button `cancel` in deposit form')

		it ('should show confirm div when click sub in deposit form')
		it ('should not show confirm div when customer, account, or start date is not exist')

	})

	describe ('Make a deposit: Select an account', function (){
		it ('should load accounts after select a customer')
		it ('should change purchasing account when a new account selected');

		it ('should disable start date input when account is not selected')
		it ('should enable start date input when account is selected') 

		it ('should reset groupon when select another account');

		it ('should reset vm.model.depositing.account before applying change')

		it ('should show selected account when both account and start date are selected')

	})

	describe ('Make a deposit: select a groupon', function (){
		it ('should load groupon after select a customer and an account');
		it ('should load groupon after change from an account to another');
		it ('should disable `member number` input when selects a groupon')
		it ('should enable `member number` input when not select a groupon')

		xit ('should disable groupon when not select customer and accounts')
		xit ('should disable groupon when an account with attribute ungrouponable selected')

		xit ('should reset `vm.model.depositing.groupon` before apply change when groupon value changed')

		it ('should assign leaders member quantity as quantity of the customer groupon when the leader selected')

		xit ('should disable quantity when a leader selected')

		it ('should set default start date as today after select an account')
	})

	describe ('Make a deposit: Search customers', function (){
		xit ('should return customer info when valid')
		xit ('should display message `not found` when no customer found')
		it ('should hide message when input is empty')

		it ('should save customer info when the customer is selected')

		it ('should reset depositing.account when search other customers after selecting one')
	})

})