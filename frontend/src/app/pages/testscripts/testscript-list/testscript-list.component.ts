import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestScript } from '../../../models/testscript/testscripts';
import { Defect } from '../../../models/testscript/defects';
import { TestScriptAssignment } from '../../../models/testscript/testscriptassignment';
import { TestStep } from '../../../models/testscript/teststeps';
import { DefectsServices } from '../../../services/defects/defects.services';
import { TestScriptsServices } from '../../../services/testscripts/testscripts.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-testscript-list',
  templateUrl: './testscript-list.component.html',
  styleUrl: './testscript-list.component.scss'
})
export class TestscriptListComponent implements OnInit {

  testScripts: TestScript[] = [];
  filteredTestScripts: TestScript[] = [];
  searchQuery: string = '';
  // addTestScriptForm: FormGroup;
  showModal: boolean = false;
  
  constructor(
    private testScriptService: TestScriptsServices,
    private router: Router,
    private fb: FormBuilder
  ) {
    // this.addTestScriptForm = this.fb.group({
    //   process: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
    //   test: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
    //   testScriptDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]]
    // });
  }

  ngOnInit(): void {
    this.loadTestScripts();
  }

  loadTestScripts(): void {
    this.testScriptService.getAllScripts().subscribe((testScripts) => {
      this.testScripts = testScripts;
      this.filteredTestScripts = testScripts;
    });
  }
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredTestScripts = this.testScripts.filter(testScript =>
      testScript.process?.toLowerCase().includes(query) ||
      testScript.test?.toLowerCase().includes(query) ||
      testScript.testScriptDescription?.toLowerCase().includes(query)
    );
  }
  getFormattedDate(date: any): string {
    if (!date) {
      return '';
    }
  
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return '';
    }
  
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear();
  
    return `${day} ${month} ${year}`;
  }
  viewArchived(): void {
    this.router.navigate(['/projects']);
  }

  // openModal(): void {
  //   this.showModal = true;
  // }

  // closeModal(): void {
  //   this.showModal = false;
  // }

  // createTestScript(): void {
  //   if (this.addTestScriptForm.invalid) {
  //     this.addTestScriptForm.markAllAsTouched();
  //     return;
  //   }
  
  //    const newTestScript = this.addTestScriptForm.value;
  //   this.testScriptService.createTestScript(newTestScript).subscribe((testScript) => {
  //     this.router.navigate(['/testscript-update', testScript.testScriptId]);
  //     this.closeModal();
  //   });
  // }
}
