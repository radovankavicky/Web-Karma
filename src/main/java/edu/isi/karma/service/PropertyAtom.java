/*******************************************************************************
 * Copyright 2012 University of Southern California
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 	http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * This code was developed by the Information Integration Group as part 
 * of the Karma project at the Information Sciences Institute of the 
 * University of Southern California.  For more information, publications, 
 * and related projects, please see: http://www.isi.edu/integration
 ******************************************************************************/

package edu.isi.karma.service;

import edu.isi.karma.modeling.alignment.Name;

public class PropertyAtom extends Atom {

	private Name classPredicate;
	private Name argument1;
	private Name argument2;
	
	public PropertyAtom(Name classPredicate, Name argument1, Name argument2) {
		this.classPredicate = classPredicate;
		this.argument1 = argument1;
		this.argument2 = argument2;
	}

	public Name getClassPredicate() {
		return classPredicate;
	}

	public Name getArgument1() {
		return argument1;
	}	
	
	public Name getArgument2() {
		return argument2;
	}	
	
}
